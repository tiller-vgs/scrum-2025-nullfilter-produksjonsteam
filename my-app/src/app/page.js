import React from "react";

function Page() {
  return (
    <div>
      <form action="/dashboard">
        <label htmlFor="uname">Username:</label>
        <br />
        <input
          className="bg-gray-200 outline-black outline-1"
          type="text"
          id="uname"
          name="uname"
        />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          className="bg-gray-200 outline-black outline-1"
          type="text"
          id="password"
          name="password"
        />
        <br />
        <br />
        <input className="bg-blue-100" type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Page;
