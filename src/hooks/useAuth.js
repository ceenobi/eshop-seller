import { useContext } from "react";
import { AuthContext } from "@/config";

export const useAuth = () => useContext(AuthContext);
