import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { getFinishId, resetFinishStore } from "@/lib/bike-scene/finish-store";
import { ColourPicker } from "./ColourPicker";

describe("ColourPicker", () => {
  beforeEach(() => {
    resetFinishStore();
  });

  it("offers every finish with Ocean selected first", () => {
    render(<ColourPicker />);
    expect(screen.getByRole("radio", { name: "Ocean" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Coral" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Sky" })).not.toBeChecked();
  });

  it("updates the shared finish when a colour is chosen", async () => {
    render(<ColourPicker />);
    await userEvent.click(screen.getByRole("radio", { name: "Coral" }));
    expect(getFinishId()).toBe("coral");
    expect(screen.getByRole("radio", { name: "Coral" })).toBeChecked();
  });

  it("is a labelled group", () => {
    render(<ColourPicker />);
    expect(
      screen.getByRole("group", { name: "Frame colour" }),
    ).toBeInTheDocument();
  });
});
