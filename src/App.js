import React, { useState } from "react";
import { EmbedWrapper, CardNumber, ExpiryDate, CardCvc } from "dibsy-react";
import "dibsy-react/dist/index.css";
import axios from "axios";
import "./App.css";

function App() {

  // State to determine whether the user has filled the form with valid values.
  // If canSubmit is false, disable the Submit button.

  const [canSubmit, setCanSubmit] = useState(false);

  // Function that will be called when user hits submit.
  // It must send an API request to your backend endpoint, to request for a paymentToken.
  // Function must take event, and submitPayment function as a parameter and call the 
  // submitPayment function with a paymentToken.

  function onSubmit(e, submitPayment) {
    e.preventDefault();

    axios
      .post(`http://localhost:4545/payment-token`)
      .then((res) => {
        if (res?.data) {
          submitPayment(res.data);
        } else {
          console.log("Error while submitting payment");
        }
      })
      .catch((error) => console.log(error));
  }

  // Callback function that is called when the payment is completed. 
  // The function must take two parameters, a Boolean indicating if the payment 
  // has been sucessful or not, and the payment object.

  function onPaymentComplete(success, payment) {
    console.log(success, payment);
  }

  return (
    <div>
      <EmbedWrapper
        // Callback function that is called, if there is an error rendering the fields.
        onErrors={(errors) => {
          console.log(errors);
        }}
        // publicKey found under API keys on your Dashboard.
        publicKey="pk_test_Jew3tnxL1oI7YVbX8sDGiNE3nzZYyvvYFIwm"
        // Callback function that determines if the checkout form should be submitted.
        // For example, if the cardholder has entered illegal values or has not completed form,
        // false is returned. Hint: use this to disable or enable checkout button
        onCanSubmitChange={(value) => {
          setCanSubmit(value);
        }}
        // When payment is complete, the function is called.
        onPaymentComplete={onPaymentComplete}
      >

        {/* submitPayment is a function that must be called when the customer clicks on the Submit button. */}
        {/* isCheckoutSubmitted returns a Boolean indicating if the payment has been submitted */}
        {({ submitPayment, isCheckoutSubmitted }) => (
          <div className={"card-container"}>
            <CardNumber />
            <div className="row">
              <div className="col">
                <ExpiryDate />
              </div>
              <div className="col">
                <CardCvc />
              </div>
            </div>
            <button
              className={"submit-button"}
              onClick={(e) => onSubmit(e, submitPayment)}
              disabled={!canSubmit || isCheckoutSubmitted}
              type="submit"
            >
              {!isCheckoutSubmitted ? "Submit checkout" : "Submitting ..."}
            </button>
          </div>
        )}
      </EmbedWrapper>
    </div>
  );
}

export default App;
