import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PolicyUploadForm from "./PolicyUploadForm";

describe("PolicyUploadForm", () => {
  it("disables submit until a file is chosen", () => {
    render(<PolicyUploadForm onUpload={() => {}} />);
    expect(screen.getByRole("button", { name: /upload/i })).toBeDisabled();
  });

  it("shows the backend error message when upload fails", async () => {
    const onUpload = vi
      .fn()
      .mockRejectedValue(new Error("Cedar syntax error: unexpected token `}`"));
    render(<PolicyUploadForm onUpload={onUpload} />);

    const file = new File(["bad cedar"], "broken.cedar", {
      type: "text/plain",
    });
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, file);
    await userEvent.click(screen.getByRole("button", { name: /upload/i }));

    expect(await screen.findByText(/Cedar syntax error/i)).toBeInTheDocument();
  });

  it("clears the form after a successful upload", async () => {
    const onUpload = vi.fn().mockResolvedValue({});
    render(<PolicyUploadForm onUpload={onUpload} />);

    const file = new File(
      ["permit(principal, action, resource);"],
      "good.cedar",
      { type: "text/plain" },
    );
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, file);
    await userEvent.click(screen.getByRole("button", { name: /upload/i }));

    expect(onUpload).toHaveBeenCalledWith(file);
  });
});
