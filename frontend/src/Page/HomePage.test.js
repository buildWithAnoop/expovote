import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ to, children, className }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

jest.mock(
  "framer-motion",
  () => ({
    motion: {
      div: ({ children, whileHover, animate, initial, transition, ...props }) => (
        <div {...props}>{children}</div>
      ),
    },
  }),
  { virtual: true }
);

import HomePage from "./HomePage";

describe("HomePage - Removed Sections and Preserved Hero Verification", () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  test("1. Renders Hero section with badge, heading, subtitle, and primary actions", () => {
    expect(screen.getByText("OFFICIAL AITM PORTAL")).toBeInTheDocument();
    expect(screen.getByText(/Excellence in/i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Recognition/i)).toBeInTheDocument();

    const startRatingLink = screen.getByRole("link", { name: "Start Rating" });
    expect(startRatingLink).toBeInTheDocument();
    expect(startRatingLink).toHaveAttribute("href", "/participants");

    const registrationLink = screen.getByRole("link", { name: "Student Registration" });
    expect(registrationLink).toBeInTheDocument();
    expect(registrationLink).toHaveAttribute("href", "/register");
  });

  test("2. Completely removes Announcements section", () => {
    expect(screen.queryByText(/Announcements/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Live Updates/i)).not.toBeInTheDocument();
  });

  test("3. Completely removes Fake Statistics / Database Counters section", () => {
    expect(screen.queryByText("Active Events")).not.toBeInTheDocument();
    expect(screen.queryByText("Student Participants")).not.toBeInTheDocument();
    expect(screen.queryByText("Total Ratings")).not.toBeInTheDocument();
    expect(screen.queryByText("Transparent")).not.toBeInTheDocument();
    expect(screen.queryByText("50+")).not.toBeInTheDocument();
    expect(screen.queryByText("1200+")).not.toBeInTheDocument();
    expect(screen.queryByText("5000+")).not.toBeInTheDocument();
    expect(screen.queryByText("100%")).not.toBeInTheDocument();
  });

  test("4. Completely removes About the Platform section", () => {
    expect(screen.queryByText("About The Platform")).not.toBeInTheDocument();
    expect(screen.queryByText("Empowering Student Talent Through Technology")).not.toBeInTheDocument();
    expect(screen.queryByText(/RPWS \(Rate Page Web System\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Real-time Results/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comprehensive Analytics/i)).not.toBeInTheDocument();
  });

  test("5. Completely removes Schedule section", () => {
    expect(screen.queryByText("Event Timeline")).not.toBeInTheDocument();
    expect(screen.queryByText(/Registration Deadline/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Evaluation & Voting/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Winners Announced/i)).not.toBeInTheDocument();
  });

  test("6. Completely removes Memories / Gallery section", () => {
    expect(screen.queryByText("Event Gallery")).not.toBeInTheDocument();
    expect(screen.queryByText(/Moments of innovation/i)).not.toBeInTheDocument();
  });

  test("7. Completely removes Common Questions / FAQ section", () => {
    expect(screen.queryByText("Frequently Asked Questions")).not.toBeInTheDocument();
    expect(screen.queryByText(/Common Questions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/How do I vote for a project\?/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Can I vote multiple times\?/i)).not.toBeInTheDocument();
  });

  test("8. Completely removes Ready to Host an Event? CTA section", () => {
    expect(screen.queryByText("Ready to Host an Event?")).not.toBeInTheDocument();
    expect(screen.queryByText(/Join the digital revolution at AITM/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Explore Participants" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "View Winners" })).not.toBeInTheDocument();
  });
});
