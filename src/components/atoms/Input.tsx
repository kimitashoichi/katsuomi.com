/**
 *
 * Input
 *
 */

import React, { FC, ReactElement } from "react";
import styled from "styled-components";

//import utils
import * as colors from "utils/color";
import * as fontSize from "utils/fontSize";

interface DefaultProps {
  placeholder?: string;
  isPassword: boolean;
  isEmail?: boolean;
  isRequired?: boolean;
  value?: string;
  width?: string;
  borderColor?: string;
  backgroundColor?: string;
  margin?: string[];
  padding?: string[];
  onChange: (value: string) => void;
  children?: string | ReactElement<any>;
}

interface InputStyleProps {
  width?: string;
  borderColor?: string;
  backgroundColor?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

const InputWrapper = styled.input<InputStyleProps>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : colors.WHITE};
  border: 2px
    ${props => (props.borderColor ? props.borderColor : colors.BORDER_GRAY)}
    solid;
  outline: none;
  font-size: ${fontSize.MINI};
  transition: all 0.2s;
  color: ${colors.BLACK};
  margin-top: ${props => props.marginTop && props.marginTop};
  margin-bottom: ${props => props.marginBottom && props.marginBottom};
  margin-left: ${props => props.marginLeft && props.marginLeft};
  margin-right: ${props => props.marginRight && props.marginRight};
  padding-top: ${props => props.paddingTop && props.paddingTop};
  padding-bottom: ${props => props.paddingBottom && props.paddingBottom};
  padding-left: ${props => props.paddingLeft && props.paddingLeft};
  padding-right: ${props => props.paddingRight && props.paddingRight};
  &:focus {
    border-color: ${colors.LIGHTER_BLUE};
  }
  width: ${props => (props.width ? props.width : "inherit")};
`;

const Input: FC<DefaultProps> = ({
  placeholder,
  value,
  width,
  onChange,
  isPassword,
  isEmail,
  isRequired,
  borderColor,
  backgroundColor,
  margin,
  padding
}) => {
  return (
    <InputWrapper
      type={isPassword ? "password" : isEmail ? "email" : undefined}
      placeholder={placeholder}
      value={value}
      width={width}
      required={isRequired}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      marginTop={margin && margin[0]}
      marginBottom={margin && margin[1]}
      marginLeft={margin && margin[2]}
      marginRight={margin && margin[3]}
      paddingTop={padding && padding[0]}
      paddingBottom={padding && padding[1]}
      paddingLeft={padding && padding[2]}
      paddingRight={padding && padding[3]}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default Input;
