# QA and Testing Guidelines

Standards for writing ABAP Unit tests within the Harness Engineering framework. The **QA Engineer** agent refers to this guide when creating or updating test classes.

## 1. Test Class Structure

All test classes should be created as local classes within the global class or program they are testing.

### Required Class Definition
```abap
CLASS ltc_test_class DEFINITION FOR TESTING
  RISK LEVEL HARMLESS
  DURATION SHORT.

  PRIVATE SECTION.
    DATA: cut TYPE REF TO zcl_my_class. " Class Under Test (CUT)

    CLASS-METHODS: class_setup.    " Run once before any test in the class
    CLASS-METHODS: class_teardown. " Run once after all tests in the class
    METHODS: setup.                " Run before each test method
    METHODS: teardown.             " Run after each test method

    METHODS: test_method_name FOR TESTING.

ENDCLASS.
```

## 2. Test Isolation & Mocking

ABAP Unit tests must not depend on actual database records unless running an integration test. Use **TEST-SEAMS** to mock database queries or external dependencies.

### Using TEST-SEAMS
```abap
" Inside the Class Under Test (CUT)
TEST-SEAM select_data.
  SELECT * FROM sflight INTO TABLE @lt_sflight WHERE carrid = @iv_carrid.
END-TEST-SEAM.
```

### Injecting Mocks
```abap
" Inside the Test Class
METHOD test_method_name.
  " Arrange: Inject mock data
  TEST-INJECTION select_data.
    lt_sflight = VALUE #( ( carrid = 'LH' connid = '0400' price = 500 ) ).
  END-TEST-INJECTION.

  " Act: Call the method under test
  DATA(result) = cut->get_flights( 'LH' ).

  " Assert: Verify the result
  cl_abap_unit_assert=>assert_equals(
    act = lines( result )
    exp = 1
    msg = 'Should return exactly 1 flight' ).
ENDMETHOD.
```

## 3. Best Practices

- **Naming**: Test methods start with `test_` and clearly describe what is tested (e.g., `test_calc_discount_valid`)
- **Setup**: Always initialize `cut` (Class Under Test) inside the `setup` method for a fresh instance per test
- **Assertions**: Use `cl_abap_unit_assert` exclusively with meaningful `msg` parameters
- **Coverage**: Test both positive (happy path) and negative (error handling) scenarios

---

## 4. ATC (ABAP Test Cockpit) Standards

Run `RunATCCheck` on every object **after** `RunUnitTests` passes. This is the third mandatory step in the Post-Write chain.

### Priority Thresholds

| Priority | Label | Required Action |
|----------|-------|----------------|
| 1 | Error | **BLOCK** — must fix before `Activate` |
| 2 | Warning | PM review required; explicit approval to proceed |
| 3 | Info | Log to task-template § 4.2 only |

### Common ATC Check Categories

- **Naming conventions**: Z* prefix enforcement, method/variable naming
- **Dead code**: unused variables, unreachable statements
- **SQL quality**: `SELECT *` instead of explicit field list, missing `WHERE` clause guards
- **Exception handling**: unhandled exceptions, missing `CATCH` blocks
- **Performance**: nested SELECT in loops, missing indexes

### Logging ATC Results

Record findings in `docs/task-template.md § 4.2 ATC Check Results`. Even Priority 3 findings should be logged for trend tracking across tasks.

---
*Maintained by the Harness Engineering Team | Last Updated: 2026-05-05*
