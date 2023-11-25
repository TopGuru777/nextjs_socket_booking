const BASE_API = "https://irislashinc.com/api";

export const getBookingList = async () => {
    try {
        const response = await fetch(`${BASE_API}/booking`, {
            cache: "no-cache",
            headers: {
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
                'Content-Type': 'application/json',
            },
        });
        const responseData = await response.json();
        return responseData.hasOwnProperty('content') ? [] : responseData;
    } catch (error) {
        return error;
    }
};

export const getStaffList = async () => {
    try {
        const response = await fetch(`${BASE_API}/staff`, {
            cache: "no-cache",
            headers: {
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
        });
        const responseData = await response.json();
        return responseData.hasOwnProperty('content') ? [] : responseData;
    } catch (error) {
        return error;
    }
};

export const getServiceList = async () => {
    try {
        const response = await fetch(`${BASE_API}/service`, {
            cache: "no-cache",
            headers: {
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
        });
        const responseData = await response.json();
        return responseData.hasOwnProperty('content') ? [] : responseData;
    } catch (error) {
        return error;
    }
};

export const getCustomerList = async () => {
    try {
        const response = await fetch(`${BASE_API}/customer`, {
            cache: "no-cache",
            headers: {
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
        });
        const responseData = await response.json();
        return responseData.hasOwnProperty('content') ? [] : responseData;
    } catch (error) {
        return error;
    }
};

export const getStatusList = async () => {
    try {
        const response = await fetch(`${BASE_API}/status`, {
            cache: "no-cache",
            headers: {
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
        });
        const responseData = await response.json();
        return responseData.hasOwnProperty('content') ? [] : responseData;
    } catch (error) {
        return error;
    }
}

export const createBooking = async (data: any) => {
    try {
        const response = await fetch(`https://irislashinc.com/jsonapi/node/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
            body: JSON.stringify({ data: data }),
        });
        return await response.json();
    } catch (error) {
        return error;
    }
};

export const createCustomer = async (data: any) => {
    try {
        const response = await fetch(`https://irislashinc.com/jsonapi/node/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
            body: JSON.stringify({ data: data }),
        });
        return await response.json();
    } catch (error) {
        return error;
    }
};

export const updateBooking = async (data: any) => {
    try {
        const response = await fetch(`https://irislashinc.com/jsonapi/node/booking/${data.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
            body: JSON.stringify({ data: data }),
        });
        return await response.json();
    } catch (error) {
        return error;
    }
};

export const deleteBooking = async (bookingId: string) => {
    try {
        const response = await fetch(` https://irislashinc.com/jsonapi/node/booking/${bookingId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}

export const searchCustomer = async (searchValue: string) => {
    try {
        const response = await fetch(`https://irislashinc.com/api/irislash-core-customer/${searchValue}?_format=json`, {
            headers: {
                Authorization: `Basic bWF5dXI6bWF5dXIxMjM=`,
            },
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}
