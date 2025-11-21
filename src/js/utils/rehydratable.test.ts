import { describe, expect, it } from "vitest";

import { rehydratable, rehydrate } from "./rehydratable";

// Test fixture classes
@rehydratable("TestClass")
class TestClass {
  value?: number;
  constructor(value?: number) {
    this.value = value;
  }
  method() {
    return "test";
  }
}

@rehydratable("OtherClass")
class OtherClass {
  method() {
    return "other";
  }
}

describe("@rehydratable decorator", () => {
  it("should create new instances with __rehydrationType tag", () => {
    // Create a NEW instance (not rehydrating)
    const instance = new TestClass(42);

    // Should have the __rehydrationType tag
    expect((instance as any).__rehydrationType).toBe("TestClass");
    expect(instance.value).toBe(42);
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
