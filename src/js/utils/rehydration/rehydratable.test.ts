import { describe, expect, it } from "vitest";

import { dehydrate, registerRehydratable, rehydrate } from "./rehydratable";

// Test fixture classes
class TestClass {
  value?: number;
  constructor(value?: number) {
    this.value = value;
  }
  method() {
    return "test";
  }
}
registerRehydratable("TestClass", TestClass);

class OtherClass {
  method() {
    return "other";
  }
}
registerRehydratable("OtherClass", OtherClass);

describe("registerRehydratable()", () => {
  it("should add __rehydrationType during dehydrate", () => {
    const instance = new TestClass(42);
    const dehydrated = dehydrate({ item: instance });

    expect((dehydrated.item as any).__rehydrationType).toBe("TestClass");
    expect(dehydrated.item.value).toBe(42);
  });
});

describe("rehydrate()", () => {
  it("should rehydrate a registered class instance", () => {
    const plainObject = {
      testProp: { value: 42, __rehydrationType: "TestClass" },
    } as any as { testProp: TestClass };

    const result = rehydrate(plainObject);

    expect(result.testProp).toBeInstanceOf(TestClass);
    expect(result.testProp.method()).toBe("test");
    expect(result.testProp.value).toBe(42);
  });

  it("should leave plain objects unchanged", () => {
    const plainObject = {
      name: "test",
      nested: { value: 42 },
      array: [1, 2, 3],
    };

    const result = rehydrate(plainObject);

    expect(result).toEqual(plainObject);
    expect(result.nested).toEqual({ value: 42 });
    expect(Object.getPrototypeOf(result.nested)).toBe(Object.prototype);
  });

  it("should ignore unknown rehydration types", () => {
    const plainObject = {
      unknown: { value: 42, __rehydrationType: "UnknownClass" },
    };

    const result = rehydrate(plainObject);

    expect(result.unknown).toEqual({ value: 42, __rehydrationType: "UnknownClass" });
    expect(Object.getPrototypeOf(result.unknown)).toBe(Object.prototype);
  });

  it("should handle multiple rehydratable properties", () => {
    const plainObject = {
      propA: { __rehydrationType: "TestClass" },
      propB: { __rehydrationType: "OtherClass" },
      propC: { plain: true },
    } as any as {
      propA: TestClass;
      propB: OtherClass;
      propC: object;
    };

    const result = rehydrate(plainObject);

    expect(result.propA).toBeInstanceOf(TestClass);
    expect(result.propA.method()).toBe("test");
    expect(result.propB).toBeInstanceOf(OtherClass);
    expect(result.propB.method()).toBe("other");
    expect(result.propC).toEqual({ plain: true });
  });

  it("should preserve primitive values", () => {
    const plainObject = {
      str: "hello",
      num: 42,
      bool: true,
      nullVal: null,
      undefinedVal: undefined,
      zero: 0,
      emptyStr: "",
    };

    const result = rehydrate(plainObject);

    expect(result).toEqual(plainObject);
    expect(result.str).toBe("hello");
    expect(result.num).toBe(42);
    expect(result.bool).toBe(true);
    expect(result.nullVal).toBe(null);
    expect(result.undefinedVal).toBe(undefined);
    expect(result.zero).toBe(0);
    expect(result.emptyStr).toBe("");
  });

  it("should rehydrate objects nested in sub-objects", () => {
    const plainObject = {
      parent: {
        child: { __rehydrationType: "TestClass" },
      },
    } as any as {
      parent: {
        child: TestClass;
      };
    };

    const result = rehydrate(plainObject);

    expect(result.parent.child).toBeInstanceOf(TestClass);
    expect(result.parent.child.method()).toBe("test");
  });

  it("should rehydrate objects in arrays", () => {
    const plainObject = {
      items: [{ __rehydrationType: "TestClass" }, { __rehydrationType: "TestClass" }],
    } as any as {
      items: TestClass[];
    };

    const result = rehydrate(plainObject);

    expect(result.items[0]).toBeInstanceOf(TestClass);
    expect(result.items[0].method()).toBe("test");
    expect(result.items[1]).toBeInstanceOf(TestClass);
    expect(result.items[1].method()).toBe("test");
  });

  it("should rehydrate objects in arrays nested in sub-objects", () => {
    const plainObject = {
      parent: {
        child: {
          array: [{ __rehydrationType: "TestClass" }, { __rehydrationType: "TestClass" }],
        },
      },
    } as any as {
      parent: {
        child: {
          array: TestClass[];
        };
      };
    };

    const result = rehydrate(plainObject);

    expect(result.parent.child.array[0]).toBeInstanceOf(TestClass);
    expect(result.parent.child.array[0].method()).toBe("test");
    expect(result.parent.child.array[1]).toBeInstanceOf(TestClass);
    expect(result.parent.child.array[1].method()).toBe("test");
  });

  it("should handle null and undefined values gracefully", () => {
    const plainObject = {
      nullValue: null,
      undefinedValue: undefined,
      validValue: { __rehydrationType: "TestClass" },
    } as any as {
      nullValue: null;
      undefinedValue: undefined;
      validValue: TestClass;
    };

    const result = rehydrate(plainObject);

    // Null and undefined should pass through unchanged
    expect(result.nullValue).toBe(null);
    expect(result.undefinedValue).toBe(undefined);
    // Valid value should be rehydrated
    expect(result.validValue).toBeInstanceOf(TestClass);
  });

  it("should skip rehydration if object already has correct prototype", () => {
    // Create an instance that already has the correct prototype
    const alreadyHydrated = new TestClass();

    const plainObject = {
      item: alreadyHydrated,
    };

    const result = rehydrate(plainObject);

    // Should still work correctly
    expect(result.item).toBeInstanceOf(TestClass);
    expect(result.item.method()).toBe("test");
  });
});

describe("dehydrate()", () => {
  it("should convert a class instance to a plain object", () => {
    const instance = new TestClass(42);

    const result = dehydrate({ item: instance });

    expect(result.item).not.toBeInstanceOf(TestClass);
    expect(Object.getPrototypeOf(result.item)).toBe(Object.prototype);
    expect(result.item.value).toBe(42);
    expect((result.item as any).__rehydrationType).toBe("TestClass");
  });

  it("should preserve primitive values", () => {
    const props = {
      str: "hello",
      num: 42,
      bool: true,
      nullVal: null,
      undefinedVal: undefined,
      zero: 0,
      emptyStr: "",
    };

    const result = dehydrate(props);

    expect(result.str).toBe("hello");
    expect(result.num).toBe(42);
    expect(result.bool).toBe(true);
    expect(result.nullVal).toBe(null);
    expect(result.undefinedVal).toBe(undefined);
    expect(result.zero).toBe(0);
    expect(result.emptyStr).toBe("");
  });

  it("should handle plain objects without modification", () => {
    const props = {
      name: "test",
      nested: { value: 42 },
    };

    const result = dehydrate(props);

    expect(result).toEqual(props);
    expect(result.nested).toEqual({ value: 42 });
  });

  it("should dehydrate nested class instances", () => {
    const props = {
      parent: {
        child: new TestClass(100),
      },
    };

    const result = dehydrate(props);

    expect(result.parent.child).not.toBeInstanceOf(TestClass);
    expect(result.parent.child.value).toBe(100);
    expect((result.parent.child as any).__rehydrationType).toBe("TestClass");
  });

  it("should dehydrate arrays of class instances", () => {
    const props = {
      items: [new TestClass(1), new TestClass(2)],
    };

    const result = dehydrate(props);

    expect(result.items[0]).not.toBeInstanceOf(TestClass);
    expect(result.items[0].value).toBe(1);
    expect((result.items[0] as any).__rehydrationType).toBe("TestClass");
    expect(result.items[1]).not.toBeInstanceOf(TestClass);
    expect(result.items[1].value).toBe(2);
  });

  it("should dehydrate arrays nested in sub-objects", () => {
    const props = {
      parent: {
        child: {
          array: [new TestClass(10), new TestClass(20)],
        },
      },
    };

    const result = dehydrate(props);

    expect(result.parent.child.array[0]).not.toBeInstanceOf(TestClass);
    expect(result.parent.child.array[0].value).toBe(10);
    expect(result.parent.child.array[1].value).toBe(20);
  });

  it("should handle multiple class types", () => {
    const props = {
      test: new TestClass(42),
      other: new OtherClass(),
    };

    const result = dehydrate(props);

    expect(result.test).not.toBeInstanceOf(TestClass);
    expect((result.test as any).__rehydrationType).toBe("TestClass");
    expect(result.other).not.toBeInstanceOf(OtherClass);
    expect((result.other as any).__rehydrationType).toBe("OtherClass");
  });

  it("should handle null and undefined values in objects", () => {
    const props = {
      nullValue: null,
      undefinedValue: undefined,
      validValue: new TestClass(42),
    };

    const result = dehydrate(props);

    expect(result.nullValue).toBe(null);
    expect(result.undefinedValue).toBe(undefined);
    expect(result.validValue.value).toBe(42);
  });

  it("should handle arrays with mixed content", () => {
    const props = {
      mixed: [new TestClass(1), "string", 42, null, { plain: true }],
    };

    const result = dehydrate(props);

    expect(result.mixed[0]).not.toBeInstanceOf(TestClass);
    expect((result.mixed[0] as any).value).toBe(1);
    expect(result.mixed[1]).toBe("string");
    expect(result.mixed[2]).toBe(42);
    expect(result.mixed[3]).toBe(null);
    expect(result.mixed[4]).toEqual({ plain: true });
  });

  it("should be the inverse of rehydrate", () => {
    const original = new TestClass(42);
    const props = { item: original };

    const dehydrated = dehydrate(props);
    const rehydrated = rehydrate(dehydrated);

    expect(rehydrated.item).toBeInstanceOf(TestClass);
    expect(rehydrated.item.value).toBe(42);
    expect(rehydrated.item.method()).toBe("test");
  });
});
