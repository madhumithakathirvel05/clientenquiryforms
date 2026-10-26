
const form = document.querySelector("#enquiry-form");
const submitButton = document.querySelector("#submit-button");
const buttonText = document.querySelector("#button-text");
const statusMessage = document.querySelector("#form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusMessage.textContent = "";
  statusMessage.className = "";

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const enquiry = Object.fromEntries(formData.entries());

  submitButton.disabled = true;
  buttonText.textContent = "Submitting...";

  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(enquiry)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to submit your enquiry.");
    }

    statusMessage.textContent =
      "Thank you! Your enquiry has been submitted successfully.";
    statusMessage.className = "success";

    form.reset();
  } catch (error) {
    statusMessage.textContent =
      error.message || "Something went wrong. Please try again.";
    statusMessage.className = "error";
  } finally {
    submitButton.disabled = false;
    buttonText.textContent = "Submit enquiry";
  }
});
