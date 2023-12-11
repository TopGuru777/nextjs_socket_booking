import React, { ChangeEvent, FocusEvent, FC, useState } from 'react';
import styled from "styled-components";
// import { FaArrowDown } from "@react-icons/all-files/fa/FaArrowDown";
import { FaArrowDown } from 'react-icons/fa';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN!;
const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
import {
  AutoCompleteContainer,
  AutoCompleteIcon,
  Input,
  AutoCompleteItem,
  AutoCompleteItemButton,
  SpinningFaSpinner
} from "./styles";
import { areAllCharactersDigits } from '../utils/helper';
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

export const AutoCompleteNew: FC<AutoCompleteNewProps> = ({
  iconColor,
  inputStyle,
  optionStyle,
  data

}) => {
  const [search, setSearch] = useState({
    text: "",
    suggestions: []
  });
  const [loading, setLoading] = useState(false);

  const [isComponentVisible, setIsComponentVisible] = useState(true);

  const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 3 && areAllCharactersDigits(value)) {
      fetchUser(value);
    }
  }

  const onTextChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let suggestions = [] as any;
    if (value.length >= 3 && areAllCharactersDigits(value)) {
      fetchUser(value);
    } else {
      setIsComponentVisible(false);
      setSearch({ suggestions, text: value });
    }

    /*    if (value.length > 0) {
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
    */
  }


  const suggestionSelected = (value: IUser) => {
    // console.log(value.first_name, 'Niroj ')
    setIsComponentVisible(false);

    setSearch({
      text: value.first_name,
      suggestions: []
    });
  };
  // console.log(search);

  const fetchUser = (text: string) => {
    let suggestions = [] as any;
    setSearch({ suggestions, text });
    // const response = fetch(`https://irislashinc.com/api/irislash-core-customer/${text}?_format=json`,
    setLoading(true);
    const response = fetch(`https://irislashinc.com/api/irislash-core-customer/${text}?_format=json`,
      { headers: { Authorization: AUTH_TOKEN, }, })
      .then((response) => {
        return response.text();
      })
      .then((textRes) => {
        let json = [];
        if (textRes != "") {
          json = JSON.parse(textRes);
        }
        // const regex = new RegExp(`^${text}`, "i");
        suggestions = json.sort();
        // suggestions = data.sort().filter((v: IData) => regex.test(v.name));
        // console.log(suggestions);
        setLoading(false);
        setIsComponentVisible(true);
        setSearch({ suggestions, text: text });
      })
  }

  const { suggestions } = search;

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
          value={search.text}
          onChange={onTextChanged}
          onFocus={onInputFocus}
          // onChange={(e) => fetchUser(e.target.value)}
          type={"text"}
          style={inputStyle}
        />
        <AutoCompleteIcon color={iconColor} isOpen={isComponentVisible}>
          {loading ? <SpinningFaSpinner /> : <FaArrowDown />}
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
