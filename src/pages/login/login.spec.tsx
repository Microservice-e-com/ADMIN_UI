import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./Login";

describe("login page", () => {
  it("should render login page with required fields", () => {
    render(<LoginPage />);

    //getBy -> throws error if not found
    //queryBy -> returns null if not found
    //findBy -> returns promise
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" })
    ).toBeInTheDocument();

    expect(screen.getByText("Forgot password")).toBeInTheDocument();
  });
});
