import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { UserContext } from "../context/UserContext";

export default function PageNotFound() {
  const { user, setUser } = useContext(UserContext);
  const navigateTo = useNavigate();

  const checkMetaMask = async () => {
    if (typeof window.ethereum === "undefined") {
      navigateTo("/nomask");
    }

    let accounts;
    try {
      accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
    } catch (error) {
      navigateTo("/nomask");
      return;
    }

    if (!accounts || accounts.length === 0) {
      navigateTo("/nomask");
      return;
    }
    setUser((state) => ({ ...state, address: accounts[0] }));

    window.ethereum.on("accountsChanged", (accounts) => {
      if (!accounts || accounts.length === 0) {
        navigateTo("/nomask");
        return;
      }
      setUser((state) => ({ ...state, address: accounts[0] }));
    });
  };

  useEffect(() => {
    checkMetaMask();
  }, []);

  return (
    <div className="all-page-wrapper">
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        <div className="default-text size-smaller color3">
          <div style={{ textAlign: "right" }}>Logged in as:</div>
          <div>{user.address}</div>
        </div>
      </div>

      <div
        className="default-text color3"
        style={{
          textAlign: "center",
          margin: "7%",
        }}
      >
        <div
          className="default-text size-larger color3"
          style={{ marginBottom: "1%" }}
        >
          We're sorry!
        </div>
        <div className="default-text size-large color3">
          We couldn't find the page you requested.
        </div>
      </div>

      <div className="footer">
        <div className="custom-shape-divider-bottom-1648118824">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
