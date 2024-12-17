import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Make sure PropTypes is imported
import './EmployeeForm.css';

// Reusable InputField component
const InputField = ({ label, name, value, onChange, type = 'text', validation, errorMessage }) => {
  return (
    <div>
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={validation}  // Trigger validation on blur
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

// Define PropTypes for InputField
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  validation: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

// Reusable SelectField component
const SelectField = ({ label, name, value, onChange, options, validation, errorMessage }) => {
  return (
    <div>
      <label>{label}:</label>
      <select name={name} value={value} onChange={onChange} onBlur={validation}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

// Define PropTypes for SelectField
SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  validation: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    department: '',
    dateOfJoining: '',
    role: '',
  });

  const [errors, setErrors] = useState({});  // Store error messages for each field
  const [message, setMessage] = useState('');

  // General validation function to handle validation for multiple fields
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!/^[A-Za-z\s]+$/.test(value)) error = 'Name can only contain letters and spaces.';
        break;
      case 'employeeId':
        if (!/^[A-Z0-9]+$/i.test(value)) error = 'Employee ID must be alphanumeric.';
        break;
      case 'phoneNumber':
        if (value.length !== 10 || isNaN(value)) error = 'Phone number must be 10 digits.';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'dateOfJoining':
        if (new Date(value) > new Date()) error = 'Date of Joining cannot be in the future.';
        break;
      case 'department':
        if (!['HR', 'Engineering', 'Marketing'].includes(value)) error = 'Please select a valid department.';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value); // Call validation function for each field dynamically
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any errors before submitting
    if (Object.values(errors).some((error) => error !== '')) {
      alert('Please fix the validation errors');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/employees', formData);
      setMessage(response.data.message);
      setFormData({
        name: '',
        employeeId: '',
        email: '',
        phoneNumber: '',
        department: '',
        dateOfJoining: '',
        role: '',
      });
    } catch (error) {
      console.error('Error during submission:', error.response || error);
      setMessage(error.response?.data?.error || 'Submission failed.');
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          validation={() => validateField('name', formData.name)}
          errorMessage={errors.name}
        />
        <InputField
          label="Employee ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          validation={() => validateField('employeeId', formData.employeeId)}
          errorMessage={errors.employeeId}
        />
        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          validation={() => validateField('email', formData.email)}
          errorMessage={errors.email}
        />
        <InputField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          type="text"
          validation={() => validateField('phoneNumber', formData.phoneNumber)}
          errorMessage={errors.phoneNumber}
        />
        <SelectField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={['HR', 'Engineering', 'Marketing']}
          validation={() => validateField('department', formData.department)}
          errorMessage={errors.department}
        />
        <InputField
          label="Date of Joining"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChange}
          type="date"
          validation={() => validateField('dateOfJoining', formData.dateOfJoining)}
          errorMessage={errors.dateOfJoining}
        />
        <InputField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          validation={() => validateField('role', formData.role)}
          errorMessage={errors.role}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmployeeForm;
