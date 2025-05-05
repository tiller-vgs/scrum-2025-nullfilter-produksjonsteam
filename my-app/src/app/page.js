import React from "react";

function Page() {
  return (
    <div>
      <label htmlFor="uname">Username:</label>
      <br />
      <input
        className="bg-gray-200 outline-black outline-1"
        type="text"
        id="uname"
        name="uname"
        autoComplete="off"
      />
      <br />
      <label htmlFor="password">Password:</label>
      <br />
      <input
        className="bg-gray-200 outline-black outline-1"
        type="text"
        id="password"
        name="password"
        autoComplete="off"
      />
      <br />
      <br />
      <input className="bg-blue-100" type="submit" value="Submit" />
    </div>
  );
}

export default Page;
