

function UserForm({data, setData}) {
 const {fullName, status , collegeName, department, year, institutionName} = data; 
  
 const handleChange =(e) => {
  const {name , value } = e.target ; 
  setData({
      ...data,
      [name]: value,
  });
  };

  return (
    <div>
      <form>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={handleChange}
          />
        </label>
        <label>
          Current Status:
          <select
            name="status"
            value={status}
            onChange={handleChange}
          >
            {status === '' && <option value="">Choose</option>}
            <option value="ug">Undergraduate</option>
            <option value="other">Other</option>
          </select>
        </label>
        {status === 'ug' && (
          <div>
            <label>
              College Name:
              <input
                type="text"
                name="collegeName"
                value={collegeName}
                onChange={handleChange}
              />
            </label>
            <label>
              Department:
              <input
                type="text"
                name="department"
                value={department}
                onChange={handleChange}
              />
            </label>
            <label>
              Year:
              <input
                type="text"
                name="year"
                value={year}
                onChange={handleChange}
              />
            </label>
          </div>
        )}
        {status  === 'other' && (
          <label>
            Institution Name:
            <input
              type="text"
              name="institutionName"
              value={institutionName}
              onChange={handleChange}
            />
          </label>
        )}
      </form>
    </div>
  );
}

export default UserForm;
