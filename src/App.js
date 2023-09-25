import React, { useState } from "react";
import "./App.css";
import CreditcardJson from "./result.json";
import axios from "axios";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

let forest = null;
class App extends React.Component {
  componentDidMount() {
    if (!Notification) {
      alert(
        "Desktop notifications not available in your browser. Try Chromium."
      );
    }
    if (Notification.permission !== "granted") Notification.requestPermission();

    forest = new window.forestjs.RandomForest();
    // data is 2D array of size NxD. Labels is 1D array of length D
    forest.train(
      CreditcardJson.map((t) => [
        t.Time,
        t.V1,
        t.V2,
        t.V3,
        t.V4,
        t.V5,
        t.V6,
        t.V7,
        t.V8,
        t.V9,
        t.V10,
        t.V11,
        t.V12,
        t.V13,
        t.V14,
        t.V15,
        t.V16,
        t.V17,
        t.V18,
        t.V19,
        t.V20,
        t.V21,
        t.V22,
        t.V23,
        t.V24,
        t.V25,
        t.V26,
        t.V27,
        t.V28,
        t.Amount,
        t.Class,
      ]),
      [
        "Time",
        "V1",
        "V2",
        "V3",
        "V4",
        "V5",
        "V6",
        "V7",
        "V8",
        "V9",
        "V10",
        "V11",
        "V12",
        "V13",
        "V14",
        "V15",
        "V16",
        "V17",
        "V18",
        "V19",
        "V20",
        "V21",
        "V22",
        "V23",
        "V24",
        "V25",
        "V26",
        "V27",
        "V28",
        "Amount",
        "Class",
      ]
    );
    // testInstance is 1D array of length D. Returns probability
    // const labelProbability = forest.predictOne([5, 6]);
    // console.log(labelProbability);
    // testData is 2D array of size MxD. Returns array of probabilities of length M
    //const labelProbabilities = forest.predict(testData);
  }

  render() {
    return (
      <div className="app-container">
        <div className="row">
          <div className="col no-gutters">
            <NotificationContainer />
            <Checkout />
          </div>
        </div>
      </div>
    );
  }
}

const Checkout = (props) => {
  const [cardHolderName, setcardHolderName] = useState("rtertert");
  const [cvv, setcvv] = useState("567");
  const [expirationDate, setExpirationDate] = useState("2002-03");
  const [cardNumber, setCardNumber] = useState("456456456456456456456");
  const [amount, setAmount] = useState("");
  const checkTransaction = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3002/creditcard/check",
        { amount, cardHolderName, cvv, expirationDate, cardNumber }
      );
      const labelProbability = forest.predictOne(data);
      console.log(parseInt(amount));
      if (amount > 50000) {
        NotificationManager.warning('This transaction seems to be fraudelent',' ', 10000);
      }
      else{
        NotificationManager.success('Transaction check successful',' ', 10000);

      }
      await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
        service_id: "service_0qoequk",
        template_id: "template_rt16bqg",
        user_id: "M7_Si2nX5xubpX24b",
        template_params: {
          from_name: "Banking Ltd",
          to_name: "Customer",
          message:
            "A transaction attempted from your card seems to fraudulent.  Ignore if it is you",
        },
      });
    } catch {}
  };
  return (
    <div className="checkout">
      <div className="checkout-container">
        <h3 className="heading-3">Credit card checkout</h3>
        <Input
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          type="text"
          name="amount"
        />
        <Input
          onChange={(e) => setcardHolderName(e.target.value)}
          label="Cardholder's Name"
          type="text"
          name="name"
        />
        <Input
          onChange={(e) => setCardNumber(e.target.value)}
          label="Card Number"
          type="number"
          name="card_number"
          imgSrc={
            cardNumber && ["5", "6", "3", "2"].includes(cardNumber[0])
              ? "https://seeklogo.com/images/V/visa-logo-6F4057663D-seeklogo.com.png"
              : "https://brand.mastercard.com/content/dam/mccom/brandcenter/brand-history/brandhistory_mc1996_100_2x.png"
          }
        />
        <div className="row">
          <div className="col">
            <Input
              onChange={(e) => setExpirationDate(e.target.value)}
              label="Expiration Date"
              type="month"
              name="exp_date"
            />
          </div>
          <div className="col">
            <Input
              onChange={(e) => setcvv(e.target.value)}
              label="CVV"
              type="number"
              name="cvv"
            />
          </div>
        </div>

        <Button text="Pay Now" onClick={checkTransaction} />
      </div>
    </div>
  );
};

const Input = (props) => (
  <div className="input">
    <label>{props.label}</label>
    <div className="input-field">
      <input type={props.type} name={props.name} onChange={props.onChange} />
      <img src={props.imgSrc} />
    </div>
  </div>
);

const Button = (props) => (
  <button className="checkout-btn" type="button" onClick={props.onClick}>
    {props.text}
  </button>
);

export default App;
