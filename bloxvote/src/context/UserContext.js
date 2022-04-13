import { createContext, useState } from "react";
import { Voter } from "../domain/Voter";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    new Voter("0xbfc06bd91802ceccefdac434412a56be26e501d4", {
      3: "0",
      4: "1",
      5: "2",
      2: "0",
    })
  );
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
