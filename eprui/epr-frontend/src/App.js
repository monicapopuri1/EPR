// src/App.js
import React, { useState, useEffect } from 'react';

// --- Minimal Inline Styles (Simplified Look) ---
// (Keeping this for consistency)
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  buttonGroup: {
    marginBottom: '30px',
  },
  modal: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    maxWidth: '500px',
    margin: '20px auto',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '3px',
    border: '1px solid #ddd',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px 8px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px 8px',
    textAlign: 'left',
  },
  statusPending: {
    color: 'orange',
    fontWeight: 'bold',
  },
  statusCompleted: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusUnknown: {
    color: 'red',
    fontWeight: 'bold',
  }
};
// --------------------------------------------------

function App() {
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW STATE: Tracks the logged-in user and their role
  const [currentUser, setCurrentUser] = useState(null); 
  
  const [currentView, setCurrentView] = useState('login'); // Start at login
  const [formState, setFormState] = useState({ reviewerId: '', revieweeId: '' });
  const [editingReviewId, setEditingReviewId] = useState(null); 
  const [editFormData, setEditFormData] = useState({ comment: '', rating: 1 });
  const [editingEmployee, setEditingEmployee] = useState(null); 
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '' });
  
 //If admin then show all reviews else show only assigned pending reviews
  const isAdmin = currentUser?.role === 'ADMIN'; 
  const currentUserName = currentUser?.name;
  
  const fetchReviews = () => {
    fetch('/api/v1/reviews')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch reviews data from API');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          //filtering logic for two roles, for now its in front end only, later we can implementt in BE as RBAC
          let filteredData = data;
          if (!isAdmin) {
              // Employees only see pending reviews assigned to them
              filteredData = data.filter(review => 
                  review.reviewerName === currentUserName // && review.status === 'PENDING'
              );
          }
          setReviews(filteredData);
        
        } else {
          console.warn("API did not return an array for reviews. Setting state to [].", data);
          setReviews([]); 
        }
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setReviews([]); 
      });
  };
  
  // Fetch Employees and Reviews 

  useEffect(() => {

    fetch('/api/v1/employees')
      .then(response => response.json())
      .then(data => {
          setEmployees(data);
        
          const employeesWithRoles = data.map(emp => {
              // Assuming 'admin' is in the name for test admins
              const role = emp.name.toLowerCase().includes('admin') ? 'ADMIN' : 'EMPLOYEE';
              return { ...emp, role };
          });
          setEmployees(employeesWithRoles);
          
      })
      .catch(error => console.error('Error fetching employees:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };
  // fetch reviews only when a user logs in or views change
  useEffect(() => {
    if (currentUser && currentView === 'viewAllReviews') {
        fetchReviews();
    }
  }, [currentUser, currentView]);

  const handleViewChange = (view) => {
      setCurrentView(view);
  };

  // --- LOGIN LOGIC ---
  const handleLogin = (name) => {
    const user = employees.find(emp => emp.name && emp.name.toLowerCase() === name.toLowerCase());

    if (user) {
       
        setCurrentUser({ id: user.id, name: user.name, role: user.role });
        setCurrentView('home');
    } else {
        alert("User not found. Try one of the employee names (e.g., 'Raghav ADMIN' or 'Ram Employee').");
    }
  };

  const renderLoginView = () => (
    <div style={styles.modal}>
        <h2>EPR System Login</h2>
        <p>Enter your Name to log in.</p>
        <form onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.username.value;
            handleLogin(name);
        }}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Name:</label>
                <input type="text" name="username" style={styles.select} placeholder="E.g., Raghav Admin/Ram Employee" required />
            </div>
            <button type="submit">Log In</button>
        </form>
    </div>
  );
  // --- END LOGIN LOGIC ---



  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for creating a review (only accessible if isAdmin is true)
    // Check if the current user is authorized to create reviews
    if (!isAdmin) {
        alert('You must be an Admin to assign reviews.');
        return;
    }

    const { reviewerId, revieweeId } = formState;
    const reviewer = employees.find(emp => emp.id.toString() === reviewerId);
    const reviewee = employees.find(emp => emp.id.toString() === revieweeId);

    const reviewData = {
        "reviewerName": reviewer.name, 
        "revieweeName": reviewee.name, 
        "content": "", 
        "status": "PENDING", 
        "rating": 0 
    };
    
    fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    })
    .then(response => {
        if (!response.ok) { throw new Error('Failed to create review.'); }
        return response.json();
    })
    .then(() => {
        alert(`Review assignment successful for ${reviewer.name}.`);
        setCurrentView('home'); 
        setFormState({ reviewerId: '', revieweeId: '' });
    })
    .catch(error => {
        console.error('API Error:', error);
        alert('Failed to create review. Check the browser console.');
    });
  };

  const employeeOptions = employees.map(emp => (
    <option key={emp.id} value={emp.id.toString()}>
        {emp.email} ({emp.name})
    </option>
  ));

  // REview creation allowed only for Admins
  const renderCreateReviewForm = () => (
    <div style={styles.modal}>
        <h2>Assign New Review</h2>
     
        <form onSubmit={handleSubmit}>
         
            <div style={styles.inputGroup}>
                <label style={styles.label}>Reviewer (Assigner):</label>
                <select 
                    style={styles.select}
                    value={formState.reviewerId} 
                    onChange={(e) => setFormState({...formState, reviewerId: e.target.value})} 
                    required
                >
                    <option value="">-- Select Reviewer --</option>
                    {employeeOptions}
                </select>
            </div>
            {/* Reviewee select field */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Reviewee:</label>
                <select 
                    style={styles.select}
                    value={formState.revieweeId} 
                    onChange={(e) => setFormState({...formState, revieweeId: e.target.value})} 
                    required
                >
                    <option value="">-- Select Reviewee --</option>
                    {employeeOptions}
                </select>
            </div>
            <button type="submit">Assign Review (Submit)</button>
            <button 
                type="button" 
                onClick={() => setCurrentView('home')} 
                style={{ marginLeft: '10px' }}
            >
                Cancel
            </button>
        </form>
    </div>
  );

  const getStatusStyle = (status) => {

      const normalizedStatus = (status || '').toUpperCase();
      if (normalizedStatus === 'PENDING') return styles.statusPending;
      if (normalizedStatus === 'COMPLETED') return styles.statusCompleted;
      return styles.statusUnknown;
  };

  const handleReviewUpdate = (e) => {
   
      e.preventDefault();
      // 1. Find the review to update    
      const reviewToUpdate = reviews.find(r => r.id === editingReviewId);

      if (!reviewToUpdate) {
          alert("Review not found for update.");
          return;
      }
      
      // Prepare the updated payload
      const updatedReviewData = {
          reviewerName: reviewToUpdate.reviewerName,
          revieweeName: reviewToUpdate.revieweeName,
          content: editFormData.comment, 
          rating: parseInt(editFormData.rating),
          status: "COMPLETED", // The key change!
      };

      // 2. Implement the PUT API call
      fetch(`/api/v1/reviews/${editingReviewId}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedReviewData),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to update review.');
          }
          return response.json();
      })
      .then(() => {
          alert('Review completed successfully!');
          setEditingReviewId(null); // Close the modal
          fetchReviews(); // Refresh the list to show the new status
      })
      .catch(error => {
          console.error('Update API Error:', error);
          alert('Failed to update review. Check the browser console.');
      });
  };

  const renderCompleteReviewForm = () => {
  
      if (!editingReviewId) return null;
    
      // Find the review to display the name of the reviewee
      const reviewToEdit = reviews.find(r => r.id === editingReviewId);

      return (
          <div style={{...styles.modal, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000}}>
              <h2>Complete Review for {reviewToEdit?.revieweeName}</h2>
              <form onSubmit={handleReviewUpdate}>
                  {/* COMMENT FIELD */}
                  <div style={styles.inputGroup}>
                      <label style={styles.label}>Comment/Feedback:</label>
                      <textarea
                          style={{...styles.select, height: '100px'}}
                          value={editFormData.comment}
                          onChange={(e) => setEditFormData({...editFormData, comment: e.target.value})}
                          required
                      />
                  </div>

                  {/* RATING FIELD */}
                  <div style={styles.inputGroup}>
                      <label style={styles.label}>Rating (1 to 5):</label>
                      <select
                          style={styles.select}
                          value={editFormData.rating}
                          onChange={(e) => setEditFormData({...editFormData, rating: e.target.value})}
                          required
                      >
                          {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star</option>)}
                      </select>
                  </div>

                  <button type="submit">Submit Final Review</button>
                  <button 
                      type="button" 
                      onClick={() => setEditingReviewId(null)} 
                      style={{ marginLeft: '10px' }}
                  >
                      Cancel
                  </button>
              </form>
          </div>
      );
  };
  
  const renderViewAllReviews = () => {
    const reviewList = Array.isArray(reviews) ? reviews : []; 
    
    return (
        <div>
            <h2>Review Assignments ({reviewList.length})</h2>
            <p>{isAdmin ? "Showing all reviews." : "Showing your pending reviews."}</p>
            {reviewList.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Reviewer</th>
                            <th style={styles.th}>Reviewee</th>
                            <th style={styles.th}>Comment</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Action</th> {/* <-- Action Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {reviewList.map(review => {
                            const status = review.status || 'UNKNOWN';
                            const comment = review.content || '';

                            return (
                                <tr key={review.id}>
                                    <td style={styles.td}>{review.id}</td>
                                    <td style={styles.td}>{review.reviewerName}</td>
                                    <td style={styles.td}>{review.revieweeName}</td>
                                    <td style={styles.td}>{comment.length > 50 ? comment.substring(0, 50) + '...' : comment}</td>
                                    <td style={{ ...styles.td, ...getStatusStyle(status) }}>
                                        {status.toUpperCase()}
                                    </td>
                                    
                                    {/* ACTION CELL: Only show button if PENDING and they are the reviewer */}
                                    <td style={styles.td}>
                                        {status.toUpperCase() === 'PENDING' && review.reviewerName === currentUserName ? (
                                            <button 
                                                onClick={() => {
                                                    setEditingReviewId(review.id);
                                                    setEditFormData({ 
                                                        comment: review.content || '', 
                                                        rating: review.rating || 1 
                                                    });
                                                }}
                                                style={{ background: 'lightblue', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                            >
                                                Complete Review
                                            </button>
                                        ) : (
                                            <span>
                                                {status.toUpperCase() === 'PENDING' ? 'Pending' : 'Completed'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <button onClick={() => setCurrentView('home')} style={{ marginTop: '20px' }}>
                Back to Dashboard
            </button>
        </div>
    );
  };
  //Handling Employee Management View
  const handleEmployeeSubmit = (e) => {
    e.preventDefault();

    const url = editingEmployee 
        ? `/api/v1/employees/${editingEmployee.id}` // PUT URL
        : '/api/v1/employees';                      // POST URL
    
    const method = editingEmployee ? 'PUT' : 'POST';
    
    // Include the role for persistence (if your backend supports saving this field)
    const payload = { 
        ...employeeForm, 
        // Mock role based on name before sending, ensuring admin creation works
        role: employeeForm.name.toLowerCase().includes('admin') ? 'ADMIN' : 'EMPLOYEE'
    };

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) { throw new Error('Failed to save employee.'); }
        return response.json();
    })
    .then(() => {
        alert(`Employee ${editingEmployee ? 'updated' : 'created'} successfully!`);
        setEmployeeForm({ name: '', email: '' }); // Clear form
        setEditingEmployee(null);                 // Exit edit mode
        fetchEmployees();                         // Refresh the list
    })
    .catch(error => {
        console.error('Employee Save Error:', error);
        alert(`Failed to save employee. Check console for details.`);
    });
};
const handleDeleteEmployee = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This cannot be undone.")) {
        return;
    }
    
    fetch(`/api/v1/employees/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Employee deleted successfully.');
                fetchEmployees(); // Refresh the list
            } else {
                throw new Error('Failed to delete employee.');
            }
        })
        .catch(error => {
            console.error('Employee Delete Error:', error);
            alert('Failed to delete employee. Check console.');
        });
};

const startEdit = (employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({ name: employee.name, email: employee.email });
};
const fetchEmployees = () => {
    fetch('/api/v1/employees')
      .then(response => response.json())
      .then(data => {
          // Re-apply the role logic for consistency
          const employeesWithRoles = data.map(emp => {
              const role = emp.name.toLowerCase().includes('admin') ? 'ADMIN' : 'EMPLOYEE';
              return { ...emp, role };
          });
          setEmployees(employeesWithRoles);
      })
      .catch(error => console.error('Error fetching employees:', error));
};
const renderManageEmployees = () => {
    if (!isAdmin) {
        return <p>Access Denied. Only Admins can manage employees.</p>;
    }
    const renderEmployeeForm = () => (
    <div style={styles.modal}>
        <h3>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleEmployeeSubmit}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={employeeForm.name} 
                    onChange={handleEmployeeFormChange} 
                    style={styles.select} 
                    required 
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={employeeForm.email} 
                    onChange={handleEmployeeFormChange} 
                    style={styles.select} 
                    required 
                />
            </div>
            <button type="submit">{editingEmployee ? 'Update User' : 'Add User'}</button>
            <button 
                type="button" 
                onClick={() => { setEditingEmployee(null); setEmployeeForm({ name: '', email: '' }); }} 
                style={{ marginLeft: '10px' }}
            >
                Cancel
            </button>
        </form>
    </div>
);
    return (
        <div>
            <h2>Employee Management</h2>
            
            {/* Form Section: Always visible for adding/editing */}
            {renderEmployeeForm()}

            <h3 style={{ marginTop: '30px' }}>Current Employees ({employees.length})</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role (Mocked)</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td style={styles.td}>{emp.id}</td>
                            <td style={styles.td}>{emp.name}</td>
                            <td style={styles.td}>{emp.email}</td>
                            <td style={styles.td}>{emp.role}</td>
                            <td style={styles.td}>
                                <button onClick={() => startEdit(emp)} style={{ marginRight: '10px', background: 'gold' }}>Edit</button>
                                <button onClick={() => handleDeleteEmployee(emp.id)} style={{ background: 'salmon' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setCurrentView('home')} style={{ marginTop: '20px' }}>
                Back to Dashboard
            </button>
        </div>
    );
};
  // --- END RENDERING FUNCTIONS ---


  // --- MAIN  Page ---
  if (loading) {
    return <div style={styles.container}>Loading application data...</div>;
  }

  // 1. Show Login View if no user is logged in
  if (!currentUser) {const renderEmployeeForm = () => (
    <div style={styles.modal}>
        <h3>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleEmployeeSubmit}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={employeeForm.name} 
                    onChange={handleEmployeeFormChange} 
                    style={styles.select} 
                    required 
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={employeeForm.email} 
                    onChange={handleEmployeeFormChange} 
                    style={styles.select} 
                    required 
                />
            </div>
            <button type="submit">{editingEmployee ? 'Update User' : 'Add User'}</button>
            <button 
                type="button" 
                onClick={() => { setEditingEmployee(null); setEmployeeForm({ name: '', email: '' }); }} 
                style={{ marginLeft: '10px' }}
            >
                Cancel
            </button>
        </form>
    </div>
);


      return (
          <div style={styles.container}>
              {renderLoginView()}
          </div>
      );
  }

  // 2. Show Dashboard if user is logged in
  return (
    <div style={styles.container}>
      <h1>EPR System Dashboard</h1>
      <h2>Welcome <strong>{currentUser.name} </strong>  
         ( Logged in as:  {currentUser.role})    
        <button onClick={() => setCurrentUser(null)} style={{ marginLeft: '15px' }}>Logout</button>
      
         </h2>
    
      <div style={styles.buttonGroup}>
        {isAdmin && (
        <button onClick={() => handleViewChange('manageEmployees')} style={{ marginLeft: '10px' }}>
             Manage Employees (Admin)
        </button>
        )}
        {isAdmin && (
            <button onClick={() => handleViewChange('createReview')}style={{ marginLeft: '10px' }}> Create Review (Admin)</button>
        )}
        <button onClick={() => handleViewChange('viewAllReviews')} style={{ marginLeft: '10px' }}>
             View My Pending Reviews
        </button>
      </div>

      {/* Conditional Rendering */}
      {currentView === 'createReview' && renderCreateReviewForm()}
      
      {currentView === 'viewAllReviews' && renderViewAllReviews()}

      {currentView === 'manageEmployees' && renderManageEmployees()}

      {currentView === 'home' && (
        <>
           
        </>
      )}
      
      {/* Render the editing form if an ID is set */}
      {editingReviewId && renderCompleteReviewForm()} 

    </div>
  );
}

export default App;