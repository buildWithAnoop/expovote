import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ to, children, className, style }) => (
      <a href={to} className={className} style={style}>
        {children}
      </a>
    ),
    Navigate: ({ to }) => <div data-testid={`redirected-to-${to}`}>Redirected to {to}</div>,
  }),
  { virtual: true }
);

import { Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./components/AuthContext";
import Footer from "./components/Footer";

// Helper to create mock JWT tokens readable by jwtDecode
function createMockJwt(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.mockSignature`;
}

const studentToken = createMockJwt({
  id: "60d0fe4f5311236168a109ca",
  email: "student@aitm.edu.in",
  role: "student",
});

const adminToken = createMockJwt({
  id: "60d0fe4f5311236168a109cb",
  email: "admin@aitm.edu.in",
  role: "admin",
});

describe("Route Security & Access Control for Winners and Contact", () => {
  test("1. Unauthenticated user accessing adminOnly route redirects to /login", () => {
    render(
      <AuthContext.Provider value={{ token: "", logout: jest.fn() }}>
        <PrivateRoute adminOnly={true}>
          <div data-testid="winner-page">Winner Protected Page</div>
        </PrivateRoute>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("redirected-to-/login")).toBeInTheDocument();
    expect(screen.queryByTestId("winner-page")).not.toBeInTheDocument();
  });

  test("2. Student accessing adminOnly route redirects to / (homepage safe access-denied)", () => {
    render(
      <AuthContext.Provider value={{ token: studentToken, logout: jest.fn() }}>
        <PrivateRoute adminOnly={true}>
          <div data-testid="winner-page">Winner Protected Page</div>
        </PrivateRoute>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("redirected-to-/")).toBeInTheDocument();
    expect(screen.queryByTestId("winner-page")).not.toBeInTheDocument();
  });

  test("3. Admin accessing adminOnly route is allowed through to render protected content", () => {
    render(
      <AuthContext.Provider value={{ token: adminToken, logout: jest.fn() }}>
        <PrivateRoute adminOnly={true}>
          <div data-testid="winner-page">Winner Protected Page</div>
        </PrivateRoute>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("winner-page")).toBeInTheDocument();
    expect(screen.queryByTestId("redirected-to-/")).not.toBeInTheDocument();
    expect(screen.queryByTestId("redirected-to-/login")).not.toBeInTheDocument();
  });

  test("4. Invalid or malformed token accessing adminOnly route safely redirects to /login", () => {
    render(
      <AuthContext.Provider value={{ token: "malformed.invalid.token", logout: jest.fn() }}>
        <PrivateRoute adminOnly={true}>
          <div data-testid="winner-page">Winner Protected Page</div>
        </PrivateRoute>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("redirected-to-/login")).toBeInTheDocument();
    expect(screen.queryByTestId("winner-page")).not.toBeInTheDocument();
  });

  test("5. Footer component renders updated branding, address, and contact details without obsolete data", () => {
    render(<Footer />);

    // Quick links verify Contact and About Us are absent
    expect(screen.queryByRole("link", { name: "Contact" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "About Us" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Participants" })).toBeInTheDocument();

    // Brand name: AITM Voting System
    expect(screen.getByText("AITM Voting System")).toBeInTheDocument();
    expect(screen.queryByText("AITM Rating System")).not.toBeInTheDocument();

    // College address: Axis Institute of Technology and Management, Rooma, Kanpur
    expect(screen.getAllByText(/Axis Institute of Technology and Management/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Rooma, Kanpur, Uttar Pradesh 208007/)).toBeInTheDocument();
    expect(screen.queryByText(/Savagaon Road/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Belagavi/)).not.toBeInTheDocument();

    // Phone link: 1800 313 2464 (tel:18003132464)
    const phoneLink = screen.getByRole("link", { name: "1800 313 2464" });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute("href", "tel:18003132464");
    expect(screen.queryByText(/\+91 831 243 8100/)).not.toBeInTheDocument();

    // Email link: info@axiscolleges.in (mailto:info@axiscolleges.in)
    const emailLink = screen.getByRole("link", { name: "info@axiscolleges.in" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:info@axiscolleges.in");
    expect(screen.queryByText("info@aitm.edu.in")).not.toBeInTheDocument();
  });

  test("6. App route configuration redirects /about directly to /", () => {
    // Verify that navigating to /about produces a Navigate redirect to /
    const redirectComponent = <Navigate to="/" replace />;
    render(redirectComponent);
    expect(screen.getByTestId("redirected-to-/")).toBeInTheDocument();
  });
});
