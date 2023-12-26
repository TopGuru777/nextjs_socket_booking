import React, { ChangeEvent, FocusEvent, FC, useState } from 'react';
import styled from "styled-components";
// import { FaArrowDown } from "@react-icons/all-files/fa/FaArrowDown";
import { FaArrowDown, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN!;
const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
import {
  AutoCompleteContainer,
  AutoCompleteIcon,
  Input,
  AutoCompleteItem,
  AutoCompleteItemButton,
  SpinningFaSpinner
} from "../../styles";
import { useRxDB } from '@/app/db';
import { getCustomerSuggestions } from './helpers';
import { RxDatabase } from 'rxdb';

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
  uuid: string;
  email: string;
}

interface AutoCompleteProps {
  iconColor?: string;
  inputStyle?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  data: any;
  onAddNew: (value: string) => void;
  onSetValue: (values: any) => void;
  onEditCustomer: () => void;
  saveValues: () => void;
}

export const AutoComplete: FC<AutoCompleteProps> = ({
  iconColor,
  inputStyle,
  optionStyle,
  data,
  onAddNew,
  onSetValue,
  onEditCustomer,
  saveValues
}) => {
  const db: RxDatabase | null = useRxDB();
  const [search, setSearch] = useState({
    text: data.name || "",
    suggestions: []
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(data.uuid != "");

  const [isComponentVisible, setIsComponentVisible] = useState(false);

  /**
  * @desc check if all characters are digits and show suggestion on focus event
   * */
  const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 3) {
      fetchUser(value);
    }
  }

  /**
  * @desc check if all characters are digits and show suggestion on text change event
   * */
  const onTextChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let suggestions = [] as any;
    setSelected(false);
    if (value.length >= 3) {
      fetchUser(value);
    } else {
      setIsComponentVisible(false);
      setSearch({ suggestions, text: value });
    }
  }


  const suggestionSelected = (value: any) => {
    setIsComponentVisible(false);

    value.name = `${value.first_name} ${value.last_name}`;
    onSetValue(value);

    setSearch({
      text: `${value.first_name} ${value.last_name}`,
      suggestions: []
    });

    setSelected(true);
  };

  /**
   * 
   * @param text 
   * @desc get suggestions 
   */
  const fetchUser = async (text: string) => {
    let suggestions = [] as any;
    setSearch({ suggestions, text });
    setLoading(true);

    suggestions = await getCustomerSuggestions(text, db);
    console.log(suggestions);
    setLoading(false);
    setIsComponentVisible(true);
    setSearch({ suggestions, text: text });
    /*
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
        console.log(suggestions);
        setLoading(false);
        setIsComponentVisible(true);
        setSearch({ suggestions, text: text });
      })
      */
  }

  const { suggestions } = search;

  /**
   * @desc add new user
   */
  const onNewHandler = () => {
    saveValues();
    onAddNew(search.text);
  }

  /**
   * @desc clear selection
   */
  const clearSelection = () => {
    onSetValue({
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      nid: "",
      uuid: "",
      name: ""
    });
    setSearch({
      text: "",
      suggestions: []
    });
    setSelected(false);
  }

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
          type={"text"}
          style={inputStyle}
        />
        <AutoCompleteIcon color={iconColor} className='cursor-pointer'>
          {selected ? (<><FaEdit onClick={onEditCustomer} /> <FaTimes onClick={clearSelection} /></>) : (loading ? <SpinningFaSpinner /> : <FaArrowDown />)}
        </AutoCompleteIcon>
      </div>
      {
        /* show suggestion */
        suggestions.length > 0 && isComponentVisible && (
          <AutoCompleteContainer style={optionStyle}>
            {
              suggestions.map((item: IUser) => (
                <AutoCompleteItem key={item.nid}>
                  <AutoCompleteItemButton
                    key={item.first_name}
                    onClick={() => suggestionSelected(item)}
                  >
                    <p> {item.first_name} demo {item.last_name} </p>
                    <p>{item.email}</p>

                  </AutoCompleteItemButton>
                </AutoCompleteItem>
              ))
            }
          </AutoCompleteContainer>
        )
      }
      {
        /* show Add Guest button */
        suggestions.length == 0 && isComponentVisible && (
          <AutoCompleteContainer style={optionStyle}>
            <AutoCompleteItem>
              <AutoCompleteItemButton
                onClick={onNewHandler}
              >
                <FaPlus className="inline-block" /> Add Guest
              </AutoCompleteItemButton>
            </AutoCompleteItem>
          </AutoCompleteContainer>
        )
      }
    </Root>
  )
};
