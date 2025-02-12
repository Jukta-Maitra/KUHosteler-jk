import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import CourseDb from "../db/KuCourseDB.json";
import Notification from "../components/Notification"
import "../css/global.css";
import {
  signup,
  getAllcode,
  getAllHostedUnHostedHostel,
  verfyMail,
} from "../auth";

const Signup = () => {
  const [isCodeverified, setIsCodeverified] = useState(0);
  const [notify , setNotify]= useState({isOpen:false , message:'', type:''});
  const [codes, setCodes] = useState([]);
  const [hostedHostels, setHostedHostels] = useState([]);
  const [mailOtpStatus, setMailOtpStatus] = useState({
    isOtpsend: false,
    sendOtp: "",
    verified: false,
  });
  const [toggler, setToggler] = useState(0);
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    department: "Department of Engineering and technological studies",
    roomNo: "",
    religion: "Hindu",
    session: "",
    selfPhNo: "",
    profileType: 0,
    hostelName: "btmens",
    gender: "male",
    code: "",
    otp: "",
    address: "",
    dob: "",
    error: "",
    avatar: "",
    success: false,
    redirectToReferrer: false,
  });

  const {
    fname,
    lname,
    email,
    password,
    department,
    roomNo,
    religion,
    session,
    selfPhNo,
    profileType,
    hostelName,
    gender,
    address,
    dob,
    error,
    avatar,
    code,
    otp,
    success,
    redirectToReferrer,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
    if (name === "code") {
      setIsCodeverified(false);
    }
    if (name === "email") {
      setMailOtpStatus({
        isOtpsend: false,
        otp: "",
        sendOtp: "",
        verified: false,
      });
    }
    if (name === "otp") {
      setMailOtpStatus({ ...mailOtpStatus, verified: false });
    }
    if (profileType === 0) {
      setToggler(!toggler);
    }
  };

  const clickSubmit = (event) => {
    var isSignUpPossible = true;
    event.preventDefault();
    if (!isCodeverified && profileType == 1) {
      isSignUpPossible = false;
      setValues({ ...values, error: "code not verified" });
    }

    // manger already exist for selected hostel...
    else if (profileType === 1) {
      hostedHostels.forEach((hostel) => {
        if (hostel.hostelName === hostelName) {
          isSignUpPossible = false;
          setValues({ ...values, error: "Manger already exist" });
        }
      });
    }

    // if selected hostel has not hosted the service ...
    else if (profileType !== 1) {
      var isMnagerExist = false;
      hostedHostels.forEach((hostel) => {
        if (hostel.hostelName === hostelName) {
          isMnagerExist = true;
          isSignUpPossible = true;
        }
      });
      if (profileType != 1 && !isMnagerExist) {
        isSignUpPossible = false;
        setValues({ ...values, error: "Manger doest exist" });
      }
    }

    if (!mailOtpStatus.verified) {
      isSignUpPossible = false;
      setValues({
        ...values,
        error: "Mail is not verified. please verify your mail",
      });
    }

    if (isSignUpPossible) {
      setValues({ ...values, error: false });
      signup(values).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setNotify({isOpen:true, message:'Registered successfully' , type:"success"});
          setValues({
            ...values,
            fname: "",
            lname: "",
            email: "",
            password: "",
            department: "Department of Engineering and technological studies",
            religion: "Hindu",
            session: "",
            roomNo: "",
            selfPhNo: "",
            profileType: 0,
            hostelName: "btmens",
            gender: "male",
            address: "",
            code: "",
            dob: "",
            error: "",
            avatar: "",

            success: true,
            redirectToReferrer: true,
          });
        }
      });
    }
  };

  const codeverification = (event) => {
    event.preventDefault();
    var matchfound = false;
    codes.forEach((savedCode) => {
      if (code == savedCode.code) {
        setIsCodeverified(true);
        matchfound = true;
        setValues({ ...values, success: "Code is applied" });
      }
    });
    if (matchfound === false) {
      setIsCodeverified(false);
      setValues({ ...values, error: "Code is not correct" });
    }
  };

  const { isOtpsend, sendOtp, verified } = mailOtpStatus;

  const sentOtp = (event) => {
    event.preventDefault();
    // write code to verify
    let newOTP = (Math.random() + 1).toString(36).substring(7);
    setMailOtpStatus({
      ...mailOtpStatus,
      isOtpsend: !isOtpsend,
      sendOtp: newOTP,
    });

    // send the  newOTP to users mailId ...
    verfyMail({ email, newOTP }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
        console.log(data.error);
      } else {
        console.log(data.info);
      }
    });

    // also check if user exit with this mail id ....
  };

  const verifyOTP = (event) => {
    event.preventDefault();
    console.log("here is the otp".sendOtp, otp);
    if (sendOtp == otp) {
      setMailOtpStatus({
        ...mailOtpStatus,
        verified: true,
        success: "OTP varyfied",
      });
    } else {
      setValues({ ...values, error: "Entered OTP is not correct" });
    }
  };

  useEffect(() => {
    //load all codes...
    getAllcode().then((data) => {
      if (data.error) {
        console.log("Data did not fetched");
      } else {
        setCodes(data.codes);
      }
    });

    getAllHostedUnHostedHostel().then((data) => {
      if (data.error) {
        console.log("Data did not fetched");
      } else {
        setHostedHostels(data.hostedHostels);
      }
    });
  }, [profileType, toggler]);

  const signUpForm = () => (
    <>
      <div className="gradiant ">
       
          <div className="container py-3">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8">
                <div className="th card-body register text-center shadow-lg text-box animate fadeUp">
                  <div className="mb-md-5 mt-md-4 pb-2">
                    <h2 className="fw-bold mb-2 text-uppercase text-white">
                      Register as{" "}
                      {profileType == 0
                        ? "Student"
                        : profileType == 1
                        ? "Manager"
                        : "Employee"}{" "}
                    </h2>
                    <p className="text-white-50 mb-5">
                      Please fill up the following details
                    </p>

                    <div className="col form-outline text-start form-white mb-4">
                      <label
                        className="form-label text-white"
                        htmlFor="profileType"
                      >
                        Profile Type
                      </label>
                      <select
                        className="form-select"
                        name="profileType"
                        onChange={handleChange("profileType")}
                        value={profileType}
                      >
                        <option value="0">Student</option>
                        <option value="2">Employee</option>
                        <option value="1">Manager</option>
                      </select>
                    </div>

                    <div
                      className="row"
                      style={{ display: profileType == 1 ? "" : "none" }}
                    >
                      <div className="col    form-outline text-start form-white mb-4">
                        <label className="form-label text-white" htmlFor="code">
                          verify Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="code"
                          required={true}
                          placeholder="Enter verification code"
                          onChange={handleChange("code")}
                          value={code}
                        />
                      </div>
                      <div
                        className="col-3 text-center pt-4"
                        style={{
                          display: code && !isCodeverified ? "" : "none",
                        }}
                      >
                        <button
                          className="btn btn-outline-light btn-sm mt-3 "
                          type="submit"
                          onClick={codeverification}
                        >
                          verify
                        </button>
                      </div>
                      <div
                        className="col-3 text-center pt-4"
                        style={{ display: isCodeverified ? "" : "none" }}
                      >
                        <p className="text-success">Verfied</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col    form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          required={true}
                          type="email"
                          className="form-control"
                          name="username"
                          onChange={handleChange("email")}
                          value={email}
                        />
                      </div>
                      <div
                        className="col-3 text-center pt-4"
                        style={{
                          display:
                            email && !mailOtpStatus.isOtpsend ? "" : "none",
                        }}
                      >
                        <button
                          className="btn btn-outline-light btn-sm mt-3 btn-primary "
                          type="submit"
                          onClick={sentOtp}
                        >
                          Send OTP
                        </button>
                      </div>
                      <div
                        className="col-3 text-center pt-4"
                        style={{
                          display: mailOtpStatus.isOtpsend ? "" : "none",
                        }}
                      >
                        <p className="text-dark">OTP sent</p>
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col    form-outline text-start form-white mb-4"
                        style={{
                          display:
                            email && mailOtpStatus.isOtpsend ? "" : "none",
                        }}
                      >
                        <label className="form-label text-white" htmlFor="otp">
                          Enter the OTP
                        </label>
                        <input
                          required={true}
                          type="text"
                          className="form-control"
                          name="otp"
                          onChange={handleChange("otp")}
                          value={otp}
                        />
                      </div>
                      <div
                        className="col-3 text-center pt-4"
                        style={{
                          display:
                            otp &&
                            mailOtpStatus.isOtpsend &&
                            !mailOtpStatus.verified
                              ? ""
                              : "none",
                        }}
                      >
                        <button
                          className="btn btn-outline-light btn-sm mt-3 "
                          type="submit"
                          onClick={verifyOTP}
                        >
                          verify
                        </button>
                      </div>

                      <div
                        className="col-3 text-center pt-4"
                        style={{
                          display: mailOtpStatus.verified ? "" : "none",
                        }}
                      >
                        <p className="text-dark">Verfied</p>
                      </div>
                    </div>

                    {/* <div className="form-outline text-start form-white mb-4" >
            <label  className="form-label text-white" htmlFor="email" >Email</label>
            <input required={true} type="email" className="form-control" name="username" onChange={handleChange('email')} value={email}  />
          </div> */}
                    <div className="form-outline text-start form-white mb-4">
                      <label
                        className="form-label text-white"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        required={true}
                        onChange={handleChange("password")}
                        value={password}
                      />
                    </div>

                    <div className="row">
                      <div className="col-lg-6    form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="fname"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="fname"
                          required={true}
                          onChange={handleChange("fname")}
                          value={fname}
                        />
                      </div>
                      <div className=" col-lg-6  form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="lname"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="lname"
                          required={true}
                          onChange={handleChange("lname")}
                          value={lname}
                        />
                      </div>
                    </div>

                    <div
                      className="form-outline text-start form-white mb-4"
                      style={{ display: profileType == 0 ? "" : "none" }}
                    >
                      <label
                        className="form-label text-white"
                        htmlFor="department"
                      >
                        Department
                      </label>
                      <select
                          id="department"
                          className="form-control"
                          name="department"
                          required={true}
                          onChange={handleChange("department")}
                          value={department}
                        >
                          {CourseDb &&
                            CourseDb.map((course, i) => (
                              <option key={i} value={course.departmentName}>
                                {course.departmentName}
                              </option>
                            ))}
                        </select>

                    </div>

                    <div className="row">
                      <div className="col-lg-6 form-outline text-start form-white mb-4">
                        <label className="form-label text-white" htmlFor="dob">
                          Date Of Birth
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="dob"
                          required={true}
                          onChange={handleChange("dob")}
                          value={dob}
                        />
                      </div>

                      <div className="col-lg-6 form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="gender"
                        >
                          Gender
                        </label>
                        <select
                          className="form-select"
                          name="profileType"
                          onChange={handleChange("gender")}
                          value={gender}
                        >
                          <option defaultValue="male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* if not manager */}
                    <div
                      className="row"
                      style={{ display: profileType != 1 ? "" : "none" }}
                    >
                      <div className="col-lg-6 form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="hostelName"
                        >
                          Hostel Name
                        </label>
                        <select
                          id="hostelName"
                          className="form-control"
                          name="hostelName"
                          required={true}
                          onChange={handleChange("hostelName")}
                          value={hostelName}
                        >
                          {hostedHostels &&
                            hostedHostels.map((hostel, i) => (
                              <option key={i} value={hostel.hostelName}>
                                {hostel.hostelName.toUpperCase()}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div
                        className="col-lg-6 form-outline text-start form-white mb-4"
                        style={{ display: profileType == 0 ? "" : "none" }}
                      >
                        <label
                          className="form-label text-white"
                          htmlFor="roomNo"
                          style={{ display: profileType == 0 ? "" : "none" }}
                        >
                          Room No
                        </label>
                        <input
                          type="Number"
                          className="form-control"
                          name="roomNo"
                          placeholder="Ex. 10"
                          required={true}
                          onChange={handleChange("roomNo")}
                          value={roomNo}
                        />
                      </div>
                    </div>

                    {/* if manager */}
                    <div
                      className="row"
                      style={{ display: profileType == 1 ? "" : "none" }}
                    >
                      <div className="col-lg-6 form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="hostelName"
                        >
                          Hostel Name
                        </label>
                        <select
                          id="hostelName"
                          className="form-control"
                          name="hostelName"
                          required={true}
                          onChange={handleChange("hostelName")}
                          value={hostelName}
                        >
                          <option value="btmens">BT MEN'S</option>
                          <option value="banyan">BANYAN</option>
                          <option value="pg1">PG 1</option>
                          <option value="pg2">PG 2</option>
                          <option value="pg3">PG 3</option>
                          <option value="lh1">LH 1</option>
                          <option value="lh2">LH 2</option>
                        </select>
                      </div>
                      <div
                        className="col-lg-6 form-outline text-start form-white mb-4"
                        style={{ display: profileType == 0 ? "" : "none" }}
                      >
                        <label
                          className="form-label text-white"
                          htmlFor="roomNo"
                          style={{ display: profileType == 0 ? "" : "none" }}
                        >
                          Room No
                        </label>
                        <input
                          type="Number"
                          className="form-control"
                          name="roomNo"
                          placeholder="Ex. 10"
                          required={true}
                          onChange={handleChange("roomNo")}
                          value={roomNo}
                        />
                      </div>
                    </div>

                    <div className="col form-outline text-start form-white mb-4">
                      <label
                        className="form-label text-white"
                        htmlFor="selfPhNo"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="selfPhNo"
                        required={true}
                        onChange={handleChange("selfPhNo")}
                        value={selfPhNo}
                      />
                    </div>

                    <div className="row">
                      <div className="col-lg-6  form-outline text-start form-white mb-4">
                        <label
                          className="form-label text-white"
                          htmlFor="religion"
                        >
                          Religion
                        </label>
                        <select
                          className="form-select"
                          name="religion"
                          onChange={handleChange("religion")}
                          value={religion}
                        >
                          <option value="Hindu">Hindu</option>
                          <option value="Muslim">Muslim</option>
                          <option value="Christian">Christian</option>
                          <option value="Sikh">Sikh</option>
                          <option value="Buddhist">Buddhist</option>
                          <option value="Jain">Jain</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div
                        className=" col-lg-6  form-outline text-start form-white mb-4"
                        style={{ display: profileType == 0 ? "" : "none" }}
                      >
                        <label
                          className="form-label text-white"
                          htmlFor="session"
                        >
                          Session
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="session"
                          placeholder="Ex. 2018-2022"
                          required={true}
                          onChange={handleChange("session")}
                          value={session}
                        />
                      </div>
                    </div>

                    <div className="col form-outline text-start form-white mb-4">
                      <label
                        className="form-label text-white"
                        htmlFor="address"
                      >
                        Home Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        placeholder="Ex. Ratna Bhavan , Block-B12 , Kalyani , Nadia , West Bengal , 741235 "
                        required={true}
                        onChange={handleChange("address")}
                        value={address}
                      />
                    </div>

                    <div className="row">
                      <div className="col ">
                        <Link to="/">
                          <button
                            className="btn btn-outline-light btn-lg px-4 "
                            type="submit"
                          >
                            Home
                          </button>
                        </Link>
                      </div>
                      <div className="col">
                        <button
                          className="btn btn-outline-light btn-lg px-4"
                          type="submit"
                          onClick={clickSubmit}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
      </div>
    </>
  );

  const showError = () => (
    <div
      className="alert alert-danger mb-0"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info pb-0"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/auth/signin" />;
    }
  };

  return (
    <div>
     
      <Notification notify={notify} setNotify={setNotify} />
      {showSuccess()}
      {showError()}
      {signUpForm()}
      {redirectUser()}
    </div>
  );
};

export default Signup;
