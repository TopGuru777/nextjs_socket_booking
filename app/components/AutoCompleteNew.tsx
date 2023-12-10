import React, { ChangeEvent, FC, useState } from 'react';
import styled from "styled-components";
import { FaArrowDown } from "@react-icons/all-files/fa/FaArrowDown";
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN!;
const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
import {
  AutoCompleteContainer,
  AutoCompleteIcon,
  Input,
  AutoCompleteItem,
  AutoCompleteItemButton
} from "./styles";
const Root = styled.div`
  position: relative;
  width: 320px;
`;
interface IData {
  name: string;
  code: string;
}

interface IUser {
  nid: number;
  first_name: string;
  last_name: string;
}

interface AutoCompleteNewProps {
  iconColor?: string;
  inputStyle?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  data: string[];
}

export const AutoCompleteNew : FC<AutoCompleteNewProps> = ({
  iconColor,
  inputStyle,
  optionStyle,
  data

}) => {
  const [search, setSearch] = useState({
    text: "",
    suggestions: []
  });

  
  const [isComponentVisible, setIsComponentVisible] = useState(true);
  const onTextChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let suggestions = [];

    if (value.length > 0) {
      console.log(value, value.length);
      // if (value.length > 0) {
        const regex = new RegExp(`^${value}`, "i");
        suggestions = data.sort().filter((v: IData) => regex.test(v.name));
      // }
      setIsComponentVisible(true);
      setSearch({ suggestions, text: value });
    } else {
      console.log(value.length)
    }

  }

  
  const suggestionSelected = (value: IUser) => {
    console.log(value.first_name, 'Niroj ')
    setIsComponentVisible(false);

    setSearch({
      text: value.first_name,
      suggestions: []
    });
  };
  console.log(search);

  const fetchUser = (text: string) => {
  let suggestions = [];
  console.log(text);
  // const response =  fetch(`https://irislashinc.com/api/irislash-core-customer/${text}?_format=json`,
  const response =  fetch(`https://irislashinc.com/api/irislash-core-customer/646?_format=json`,
    {headers: {Authorization: AUTH_TOKEN,},})
    .then((response) => response.json())
    .then((json) => {
      // console.log(json)
      const regex = new RegExp(`^${text}`, "i");


      suggestions = json.sort();
      // suggestions = data.sort().filter((v: IData) => regex.test(v.name));
      console.log(suggestions);
      setIsComponentVisible(true);
      setSearch({ suggestions, text: text });

    })
}

const {suggestions} = search;

  return (
    <Root>
      <div
      onClick={() => setIsComponentVisible(false)}
      style={{
        display: isComponentVisible ? "block" : "none",
        width: "200vw",
        height: "200vh",
        backgroundColor: "transparent",
        position: "fixed",
        zIndex: 0,
        top: 0,
        left: 0
      }}
      />
      <div>
        <Input
          id="input"
          autoComplete="off"
          // value={search.text}
          // onChange={onTextChanged}
          onChange={(e) => fetchUser(e.target.value)}
          type={"text"}
          style={inputStyle}
        />
        <AutoCompleteIcon color={iconColor} isOpen={isComponentVisible}>
          <FaArrowDown/>
        </AutoCompleteIcon>
      </div>
      {
        suggestions.length > 0 && isComponentVisible && (
          <AutoCompleteContainer style={optionStyle}>
            { 
              suggestions.map((item: IUser) => (
                <AutoCompleteItem key={item.nid}>
                  <AutoCompleteItemButton
                    key={item.first_name}
                    onClick={() => suggestionSelected(item)}
                    >
                    {item.first_name}
                    </AutoCompleteItemButton>
                </AutoCompleteItem>
              ))
            }
          </AutoCompleteContainer>
        )
      }
    </Root>
  )
};
