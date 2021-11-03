import React, { useState } from "react";
import { EmbedWrapper, CardNumber, ExpiryDate, CardCvc } from "dibsy-react";
import "dibsy-react/dist/index.css";
import axios from 'axios';
import './App.css'

function App() {
  const [canSubmit, setCanSubmit] = useState(false);

  function onSubmit(e, submitPayment) {
    e.preventDefault();

    axios
      .post(`http://localhost:4545/payment-token`)
      .then((res) => {
        if (res?.data) {
          submitPayment(res.data);
        } else {
          console.log("Error while initiating payment");
        }
      })
      .catch((error) => console.log(error));
  }

  function onPaymentComplete(success, payment) {
    console.log(success, payment);
  }

  return (
    <div>
      <EmbedWrapper
        onErrors={(errors) => {
          console.log(errors)
        }
        }        
        publicKey="pk_test_Jew3tnxL1oI7YVbX8sDGiNE3nzZYyvvYFIwm"
        onCanSubmitChange={(value) => {
          setCanSubmit(value);
        }}
        onPaymentComplete={onPaymentComplete}
      >
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
