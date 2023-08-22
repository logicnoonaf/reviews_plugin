import React, { FC, InputHTMLAttributes, useRef, useEffect } from "react";
import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import classes from "./input.module.scss";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Input: FC<IProps> = ({ children, name, ...props }) => {
  console.log("props: ", props);
  const { control, formState } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <>
            <input
              style={
                props.type === "radio"
                  ? {
                      marginBottom: "16px",
                      height: "16px",
                      width: "16px",
                      float: "left",
                    }
                  : {
                      marginBottom: "16px",
                      height: "30px",
                      width: "230px",
                    }
              }
              name={name}
              onBlur={onBlur}
              onChange={(newValue) => {
                onChange(newValue);
              }}
              value={value ?? ""}
              {...props}
            />
          </>
        );
      }}
    />
  );
};

export default Input;
