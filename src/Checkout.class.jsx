import React from "react";
import { saveShippingAddress } from "./services/shippingService";

// Declaring ENUM.
// JavaScript doesnot support ENUM so we are declaring in the form of an object
const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: "",
  country: "",
};

export default class Checkout extends React.Component {
  /*
    constructor(props) {
      super(props);
      this.state = {
          address: emptyAddress,
          status: STATUS.IDLE,
          saveError: null,
          touched: {},
      }
  }
  */
  // we can declare class state like this also
  // This is called declaring state using class field
  state = {
    address: emptyAddress,
    status: STATUS.IDLE,
    saveError: null,
    touched: {},
  };

  // Derived state
  // In class components, we need to place it inside a function
  isValid() {
    const errors = this.getErrors(this.state.address);
    return Object.keys(errors).length === 0;
  }

  handleChange = (e) => {
    // persist the event. otherwise the event is garbage collected before it is getting accessed by the function inside setAddress.
    // So then it will be null and gives error.
    e.persist();
    // only the value that is mentioned is getting updated in the state. remaining state variables will be same.
    this.setState((state) => {
      return {
        address: {
          ...state.address,
          [e.target.id]: e.target.value,
        },
      };
    });
  }

  // Using methods, the 'this' will get bind to only inside the function, so when we refer other objects outside the function (e.g setState)
  // it will give errors as the this is bound only inside the function. To avoid this issue we can bind the method with global 'this' by declaring it inside constructor.
  // Other way is to make it a class field by declaring it as an arrow function. By this was the 'this' is not getting bound to only inside the function. It still refers to the global 'this'.
  /*
  handleBlur(event) {
    event.persist();
    this.setState((state) => {
      return {
        touched: {
          ...state.touched,
          [event.target.id]: true,
        },
      };
    });
  }
  */
  handleBlur = (event) => {
    event.persist();
    this.setState((state) => {
      return {
        touched: {
          ...state.touched,
          [event.target.id]: true,
        },
      };
    });
  }

  handleSubmit = async(event) => {
    // prevemts the form to posting back so that we can do the verification on client side.
    event.preventDefault();
    this.setState({ status: STATUS.SUBMITTING });
    if (this.isValid()) {
      try {
        await saveShippingAddress(this.state.address);
        this.props.dispatch({ type: "empty" });
        this.setState({ status: STATUS.COMPLETED });
      } catch (e) {
        this.setState({ saveError: e });
      }
    } else {
      this.setState({ status: STATUS.SUBMITTED });
    }
  }

  getErrors(address) {
    const result = {};
    if (!address.city) result.city = "City is required!";
    if (!address.country) result.country = "Country is required!";
    return result;
  }

  render() {
    const { status, saveError, touched, address } = this.state;

    // Derived State
    const errors = this.getErrors(this.state.address);

    if (saveError) throw saveError;
    if (status === STATUS.COMPLETED) {
      return <h1>Thanks for Shopping! Visit again...</h1>;
    }
    return (
      <>
        <h1>Shipping Info</h1>
        {!this.isValid() && status === STATUS.SUBMITTED && (
          <div role="alert">
            <p>Please fix the following issues:</p>
            <ul>
              {Object.keys(errors).map((key) => (
                <li key={key}>{errors[key]}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="city">City</label>
            <br />
            <input
              id="city"
              type="text"
              value={address.city}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
            />
            <p role="alert">
              {(touched.city || status === STATUS.SUBMITTED) && errors.city}
            </p>
          </div>

          <div>
            <label htmlFor="country">Country</label>
            <br />
            <select
              id="country"
              value={address.country}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
            >
              <option value="">Select Country</option>
              <option value="China">China</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="USA">USA</option>
            </select>
            <p role="alert">
              {(touched.country || status === STATUS.SUBMITTED) &&
                errors.country}
            </p>
          </div>

          <div>
            <input
              type="submit"
              className="btn btn-primary"
              value="Save Shipping Info"
              disabled={status === STATUS.SUBMITTING}
            />
          </div>
        </form>
      </>
    );
  }
}
