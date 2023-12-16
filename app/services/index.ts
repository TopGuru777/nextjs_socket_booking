import moment from "moment-timezone";

const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN!;
const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export const getBookingList = async () => {

  // const current_local_date = moment('20231214').tz("America/New_York").format("YYYY-MM-DD");
  const current_local_date = moment().tz("America/New_York").format("YYYY-MM-DD");
  

  console.log(moment('2023-12-14T00:00').tz("America/New_York"),"Niroj Gahle ------------------------- ");
  console.log(moment(`${current_local_date}T00:00`).tz("UTC").format("YYYYMMDD"),"Starting");
  console.log(moment(`${current_local_date}T24:00`).tz("UTC").format("YYYYMMDD"),"Ending");

  console.log(moment('2023-12-14T00:00').tz("UTC"),"Starting");
  console.log(moment('2023-12-14T24:00').tz("UTC"),"Ending");

  try {
    // const min_date = moment().format("YYYYMMDD");
    // const max_date = moment().format("YYYYMMDD");
    // 2023 12 14
    // https://irislashinc.com/api/booking?field_date_range_value[min]=2023-12-14 0500&field_date_range_value[max]=2023 12 150512
    
    // https://irislashinc.com/api/booking?field_date_range_value[min]=2023-12-13-05-00&field_date_range_value[max]=2023-12-14-0500


    const min_date = moment(`${current_local_date}T00:00`).tz("UTC").format("YYYYMMDDHHSS")
    const max_date = moment(`${current_local_date}T24:00`).tz("UTC").format("YYYYMMDDHHSS")

    const booking_api_url = `${BASE_API}/booking?field_date_range_value[min]=${min_date}&field_date_range_value[max]=${max_date}`;
    console.log(booking_api_url);
    const response = await fetch(booking_api_url, {
      cache: "no-cache",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    return responseData.hasOwnProperty("content") ? [] : responseData;
  } catch (error) {
    return error;
  }
};

export const getStaffList = async () => {
  try {
    const response = await fetch(`${BASE_API}/staff`, {
      cache: "no-cache",
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });
    const responseData = await response.json();
    return responseData.hasOwnProperty("content") ? [] : responseData;
  } catch (error) {
    return error;
  }
};

export const getServiceList = async () => {
  try {
    const response = await fetch(`${BASE_API}/service`, {
      cache: "no-cache",
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });
    const responseData = await response.json();
    return responseData.hasOwnProperty("content") ? [] : responseData;
  } catch (error) {
    return error;
  }
};

export const getCustomerList = async () => {
  try {
    const response = await fetch(`${BASE_API}/customer`, {
      cache: "no-cache",
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });
    const responseData = await response.json();
    return responseData.hasOwnProperty("content") ? [] : responseData;
  } catch (error) {
    return error;
  }
};

export const getStatusList = async () => {
  try {
    const response = await fetch(`${BASE_API}/status`, {
      cache: "no-cache",
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });
    const responseData = await response.json();
    return responseData.hasOwnProperty("content") ? [] : responseData;
  } catch (error) {
    return error;
  }
};

export const createBooking = async (data: any) => {
  try {
    const response = await fetch(
      `https://irislashinc.com/jsonapi/node/booking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({ data: data }),
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const createCustomer = async (data: any) => {
  try {
    const response = await fetch(
      `https://irislashinc.com/jsonapi/node/customers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({ data: data }),
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const updateCustomer = async (data: any) => {
  try {
    const response = await fetch(
      `https://irislashinc.com/jsonapi/node/customers/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({ data: data }),
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const updateBooking = async (data: any) => {
  try {
    const response = await fetch(
      `https://irislashinc.com/jsonapi/node/booking/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({ data: data }),
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const response = await fetch(
      ` https://irislashinc.com/jsonapi/node/booking/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const searchCustomer = async (searchValue: string) => {
  try {
    const response = await fetch(
      `https://irislashinc.com/api/irislash-core-customer/${searchValue}?_format=json`,
      {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};
