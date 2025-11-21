import { describe, expect, it } from "vitest";

import { rehydratable, rehydrate } from "./rehydratable";

describe("@rehydratable decorator", () => {
  it("should create new instances with __rehydrationType tag", () => {
    @rehydratable("NewInstanceClass")
    class NewInstanceClass {
      value: string;
      constructor(value: string) {
        this.value = value;
      }
    }

    // Create a NEW instance (not rehydrating)
    const instance = new NewInstanceClass("test");

    // Should have the __rehydrationType tag
    expect((instance as any).__rehydrationType).toBe("NewInstanceClass");
    expect(instance.value).toBe("test");
  });
});

describe("rehydrate()", () => {
  it("should rehydrate a registered class instance", () => {
    @rehydratable("TestClass")
    class TestClass {
      value: number;
      constructor(value: number) {
        this.value = value;
      }
      getValue() {
        return this.value * 2;
      }
    }

    const plainObject = {
      testProp: { value: 42, __rehydrationType: "TestClass" },
    } as any as { testProp: TestClass };

    const result = rehydrate(plainObject);

    expect(result.testProp).toBeInstanceOf(TestClass);
    expect(result.testProp.getValue()).toBe(84);
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
    @rehydratable("ClassA")
    class ClassA {
      methodA() {
        return "A";
      }
    }

    @rehydratable("ClassB")
    class ClassB {
      methodB() {
        return "B";
      }
    }

    const plainObject = {
      propA: { __rehydrationType: "ClassA" },
      propB: { __rehydrationType: "ClassB" },
      propC: { plain: true },
    } as any as {
      propA: ClassA;
      propB: ClassB;
      propC: object;
    };

    const result = rehydrate(plainObject);

    expect(result.propA).toBeInstanceOf(ClassA);
    expect(result.propA.methodA()).toBe("A");
    expect(result.propB).toBeInstanceOf(ClassB);
    expect(result.propB.methodB()).toBe("B");
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
    @rehydratable("NestedClass")
    class NestedClass {
      nestedMethod() {
        return "nested";
      }
    }

    const plainObject = {
      parent: {
        child: { __rehydrationType: "NestedClass" },
      },
    } as any as {
      parent: {
        child: NestedClass;
      };
    };

    const result = rehydrate(plainObject);

    expect(result.parent.child).toBeInstanceOf(NestedClass);
    expect(result.parent.child.nestedMethod()).toBe("nested");
  });

  it("should rehydrate objects in arrays", () => {
    @rehydratable("ArrayClass")
    class ArrayClass {
      arrayMethod() {
        return "array";
      }
    }

    const plainObject = {
      items: [{ __rehydrationType: "ArrayClass" }, { __rehydrationType: "ArrayClass" }],
    } as any as {
      items: ArrayClass[];
    };

    const result = rehydrate(plainObject);

    expect(result.items[0]).toBeInstanceOf(ArrayClass);
    expect(result.items[0].arrayMethod()).toBe("array");
    expect(result.items[1]).toBeInstanceOf(ArrayClass);
    expect(result.items[1].arrayMethod()).toBe("array");
  });

  it("should rehydrate objects in arrays nested in sub-objects", () => {
    @rehydratable("DeepClass")
    class DeepClass {
      deepMethod() {
        return "deep";
      }
    }

    const plainObject = {
      parent: {
        child: {
          array: [{ __rehydrationType: "DeepClass" }, { __rehydrationType: "DeepClass" }],
        },
      },
    } as any as {
      parent: {
        child: {
          array: DeepClass[];
        };
      };
    };

    const result = rehydrate(plainObject);

    expect(result.parent.child.array[0]).toBeInstanceOf(DeepClass);
    expect(result.parent.child.array[0].deepMethod()).toBe("deep");
    expect(result.parent.child.array[1]).toBeInstanceOf(DeepClass);
    expect(result.parent.child.array[1].deepMethod()).toBe("deep");
  });

  it("should handle null and undefined values gracefully", () => {
    @rehydratable("NullTestClass")
    class NullTestClass {
      method() {
        return "works";
      }
    }

    const plainObject = {
      nullValue: null,
      undefinedValue: undefined,
      validValue: { __rehydrationType: "NullTestClass" },
    } as any as {
      nullValue: null;
      undefinedValue: undefined;
      validValue: NullTestClass;
    };

    const result = rehydrate(plainObject);

    // Null and undefined should pass through unchanged
    expect(result.nullValue).toBe(null);
    expect(result.undefinedValue).toBe(undefined);
    // Valid value should be rehydrated
    expect(result.validValue).toBeInstanceOf(NullTestClass);
  });

  it("should skip rehydration if object already has correct prototype", () => {
    @rehydratable("AlreadyHydratedClass")
    class AlreadyHydratedClass {
      method() {
        return "already hydrated";
      }
    }

    // Create an instance that already has the correct prototype
    const alreadyHydrated = new AlreadyHydratedClass();

    const plainObject = {
      item: alreadyHydrated,
    };

    const result = rehydrate(plainObject);

    // Should still work correctly
    expect(result.item).toBeInstanceOf(AlreadyHydratedClass);
    expect(result.item.method()).toBe("already hydrated");
  });
});
