"use client";
import { Paper } from "@mui/material";
import "./card.css";

export function CardComponent({ children }: { children: React.ReactNode }) {
  return <Paper className="card-component">{children}</Paper>;
}

export default CardComponent;
