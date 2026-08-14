// Unit tests for validateRelease (CS-50).
//
// Runs in two environments:
//   - Browser: open tests/tests.html (loads validation.js then this file).
//   - Node:    node tests/validation.test.js
//
// The pure validator has no DOM dependency, so these tests need no browser.

(function () {
  // Resolve validateRelease from Node require or the browser global.
  let validateRelease;
  if (typeof require !== "undefined") {
    ({ validateRelease } = require("../validation.js"));
  } else {
    validateRelease = window.validateRelease;
  }

  const results = [];
  let passed = 0;
  let failed = 0;

  function record(name, ok, detail) {
    results.push({ name, ok, detail });
    if (ok) {
      passed += 1;
    } else {
      failed += 1;
    }
  }

  function assert(name, condition, detail) {
    record(name, Boolean(condition), condition ? "" : detail || "assertion failed");
  }

  // A baseline valid release used to build focused invalid cases.
  function validRelease(overrides) {
    return Object.assign(
      {
        product: "Billing API",
        version: "v1.4.0",
        title: "Faster invoice export",
        description: "Improved export speed.",
        releaseDate: "2026-06-08",
        isBreaking: false
      },
      overrides || {}
    );
  }

  // AC-004 / AC-010 / AC-012: fully valid release passes with no errors.
  (function () {
    const { valid, errors } = validateRelease(validRelease());
    assert("AC-004 valid release is valid", valid === true, "expected valid=true");
    assert("AC-012 valid release has no errors", Object.keys(errors).length === 0, JSON.stringify(errors));
  })();

  // AC-001 / AC-002: each required field, when empty, produces its own error.
  ["product", "version", "title", "description", "releaseDate"].forEach((field) => {
    const { valid, errors } = validateRelease(validRelease({ [field]: "" }));
    assert(`AC-002 empty ${field} is invalid`, valid === false, "expected invalid");
    assert(`AC-002 empty ${field} has message`, typeof errors[field] === "string" && errors[field].length > 0, JSON.stringify(errors));
  });

  // BR-002: whitespace-only counts as empty.
  (function () {
    const { valid, errors } = validateRelease(validRelease({ product: "   " }));
    assert("BR-002 whitespace product invalid", valid === false && !!errors.product, JSON.stringify(errors));
  })();

  // AC-002: all fields empty -> a message for every required field.
  (function () {
    const { valid, errors } = validateRelease({});
    const allPresent = ["product", "version", "title", "description", "releaseDate"].every((f) => !!errors[f]);
    assert("AC-002 all empty invalid", valid === false, "expected invalid");
    assert("AC-002 all empty each field has message", allPresent, JSON.stringify(errors));
  })();

  // AC-003: version format rule.
  [
    ["1.4", false],
    ["abc", false],
    ["version 1", false],
    ["v1", false],
    ["v1.4.0", true],
    ["2.0.0", true],
    ["v1.0.0-rc.1", true]
  ].forEach(([version, shouldPass]) => {
    const { errors } = validateRelease(validRelease({ version }));
    const ok = shouldPass ? !errors.version : !!errors.version;
    assert(`AC-003 version "${version}" ${shouldPass ? "accepted" : "rejected"}`, ok, JSON.stringify(errors));
  });

  // AC-009 / BR-004: title length bound (120).
  (function () {
    const at = "x".repeat(120);
    const over = "x".repeat(121);
    assert("AC-009 title 120 chars accepted", !validateRelease(validRelease({ title: at })).errors.title, "120 should pass");
    assert("AC-009 title 121 chars rejected", !!validateRelease(validRelease({ title: over })).errors.title, "121 should fail");
  })();

  // BR-005: description length bound (2000).
  (function () {
    const at = "x".repeat(2000);
    const over = "x".repeat(2001);
    assert("BR-005 description 2000 chars accepted", !validateRelease(validRelease({ description: at })).errors.description, "2000 should pass");
    assert("BR-005 description 2001 chars rejected", !!validateRelease(validRelease({ description: over })).errors.description, "2001 should fail");
  })();

  // AC-008: release date validity.
  [
    ["", false],
    ["not-a-date", false],
    ["2026-13-99", false],
    ["2026-06-08", true]
  ].forEach(([releaseDate, shouldPass]) => {
    const { errors } = validateRelease(validRelease({ releaseDate }));
    const ok = shouldPass ? !errors.releaseDate : !!errors.releaseDate;
    assert(`AC-008 date "${releaseDate}" ${shouldPass ? "accepted" : "rejected"}`, ok, JSON.stringify(errors));
  });

  // AC-012: purity — input object is not mutated.
  (function () {
    const input = validRelease({ product: "  Trim Me  " });
    const snapshot = JSON.stringify(input);
    validateRelease(input);
    assert("AC-012 input not mutated", JSON.stringify(input) === snapshot, "validateRelease mutated its input");
  })();

  // ---- Reporting ----
  const summary = `Tests: ${passed + failed}, Passed: ${passed}, Failed: ${failed}`;

  if (typeof document !== "undefined") {
    const out = document.getElementById("output");
    const lines = results
      .map((r) => `${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : "  -> " + r.detail}`)
      .join("\n");
    out.textContent = `${lines}\n\n${summary}`;
    out.className = failed === 0 ? "ok" : "bad";
  } else {
    results.forEach((r) => {
      // eslint-disable-next-line no-console
      console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : "  -> " + r.detail}`);
    });
    // eslint-disable-next-line no-console
    console.log("\n" + summary);
    if (typeof process !== "undefined") {
      process.exitCode = failed === 0 ? 0 : 1;
    }
  }
})();
