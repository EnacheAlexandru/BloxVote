import { createContext, useState } from "react";
import { Voter } from "../domain/Voter";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    contractAddress: "0xe5b2d8a553A2811C355abE77bE4eb03789133D83",
    contractAdmin: "0xbB01668045395707CaCB9656FeD430d84018295B",
    address: "",
    votes: {
      3: "0",
      4: "1",
      5: "2",
      2: "0",
    },
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
