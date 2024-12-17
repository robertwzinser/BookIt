import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  runTransaction,
  set,
} from "firebase/database";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import blankUser from "../media/blank.png";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const auth = getAuth();
  const database = getDatabase();
  const storage = getStorage();
  const [profileImageUrl, setProfileImageUrl] = useState(blankUser);

  // Styles
  const paperStyle = {
    padding: "20px",
    marginTop: "20px",
    backgroundColor: "#0A0A0A",
  };

  const buttonStyle = {
    margin: "10px 0",
  };

  // Event Handlers
  const openDeleteDialog = (serviceId) => {
    setServiceToDelete(serviceId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteConfirmOpen(false);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      handleDeleteService(serviceToDelete);
      setServiceToDelete(null);
    }
    closeDeleteDialog();
  };

  useEffect(() => {
    if (userData && userData.profile && userData.profile.imageRef) {
      fetchProfileImage(userData.profile.imageRef);
    }
  }, [userData, storage]); // Reacts to changes in userData and storage

  // useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            fetchAppointments(data.appointments);

            setUserData(data);

            if (
              data.profile.type === "business_owner" &&
              data.businessDetails &&
              data.businessDetails.servicesOffered
            ) {
              fetchServices(data.businessDetails.servicesOffered);
            } else if (data.appointments) {
            }
          }
        });
      } else {
        setUser(null);
        setUserData(null);
        setAppointments([]);
        setServices([]);
      }
    });

    return () => unsubscribe();
  }, [auth, database]);

  const goToCreateServicePage = () => {
    navigate("/create-service");
  };

  const fetchAppointments = (appointmentIds) => {
    // Ensure appointmentIds is an array, default to empty array if undefined or not an array
    const safeAppointmentIds = Array.isArray(appointmentIds)
      ? appointmentIds
      : [];

    const fetchedAppointments = [];

    safeAppointmentIds.forEach((appointmentId) => {
      const appRef = ref(database, `appointments/${appointmentId}`);
      onValue(appRef, (appSnapshot) => {
        const appointmentData = appSnapshot.val();
        if (appointmentData) {
          const serviceRef = ref(
            database,
            `services/${appointmentData.serviceId}`
          );
          onValue(serviceRef, (serviceSnapshot) => {
            const serviceData = serviceSnapshot.val();
            if (serviceData) {
              const providerRef = ref(database, `users/${serviceData.ownerId}`);
              onValue(providerRef, (providerSnapshot) => {
                const providerData = providerSnapshot.val();
                if (providerData && providerData.profile.name) {
                  const updatedAppointment = {
                    ...appointmentData,
                    key: appointmentId,
                    serviceName: serviceData.name,
                    provider: providerData.profile.name,
                  };
                  fetchedAppointments.push(updatedAppointment);
                }
              });
            }
          });
        }
      });
    });

    // Update the state after all appointments are fetched and processed
    setAppointments(fetchedAppointments);
  };

  // Function to fetch services
  const fetchServices = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return; // Ensure there is a logged-in user

    const servicesRef = ref(database, "services");
    onValue(
      servicesRef,
      (snapshot) => {
        const allServices = snapshot.val();
        const userOwnedServices = [];
        Object.keys(allServices).forEach((key) => {
          const service = allServices[key];
          if (service.ownerId === currentUser.uid) {
            // Check if the service is owned by the current user
            const serviceWithId = { ...service, id: key }; // Include the Firebase key as part of the service object
            if (service.bookings && Array.isArray(service.bookings)) {
              const bookingsPromises = service.bookings.map(
                (booking) =>
                  new Promise((resolve) => {
                    const userRef = ref(database, `users/${booking.userId}`);
                    onValue(
                      userRef,
                      (userSnapshot) => {
                        const userData = userSnapshot.val();
                        if (userData && userData.profile) {
                          resolve({
                            ...booking,
                            userName: userData.profile.name,
                          });
                        } else {
                          resolve({ ...booking }); // Handle case where user data might be missing
                        }
                      },
                      { onlyOnce: true }
                    );
                  })
              );

              Promise.all(bookingsPromises).then((completedBookings) => {
                serviceWithId.bookings = completedBookings;
                userOwnedServices.push(serviceWithId);
                setServices(userOwnedServices); // Update state with fully processed services
              });
            } else {
              userOwnedServices.push(serviceWithId);
              setServices(userOwnedServices); // Update state if there are no bookings
            }
          }
        });
      },
      { onlyOnce: true }
    );
  };

  // Function to fetch profile image
  const fetchProfileImage = (userId) => {
    if (userData && userData.profile && userData.profile.imageRef) {
      const imageRef = storageRef(storage, userData.profile.imageRef);
      getDownloadURL(imageRef)
        .then((url) => {
          setProfileImageUrl(url);
        })
        .catch((error) => {
          // If profile image doesn't exist or there's an error, set default image
          console.error("Error fetching profile image:", error);
          setProfileImageUrl(blankUser);
        });
    } else {
      // If user data or image reference is missing, set default image
      setProfileImageUrl(blankUser);
    }
  };

  const handleUnbookAppointment = () => {
    if (selectedAppointment) {
      const appointmentRef = ref(
        database,
        `appointments/${selectedAppointment.key}`
      );
      remove(appointmentRef)
        .then(() => {
          // Remove appointment from user's appointments array
          const updatedAppointments = userData.appointments.filter(
            (id) => id !== selectedAppointment.key
          );
          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment.key !== selectedAppointment.key
            )
          );
          const userRef = ref(database, `users/${user.uid}`);
          set(userRef, { ...userData, appointments: updatedAppointments });

          // Update the service data by removing the specific booking entry
          const serviceRef = ref(
            database,
            `services/${selectedAppointment.serviceId}`
          );
          onValue(serviceRef, (serviceSnapshot) => {
            let serviceData = serviceSnapshot.val();
            if (serviceData && serviceData.bookings) {
              const updatedBookings = serviceData.bookings.filter(
                (booking) =>
                  booking.userId !== user.uid ||
                  booking.date !== selectedAppointment.date ||
                  booking.time !== selectedAppointment.time
              );
              set(
                ref(
                  database,
                  `services/${selectedAppointment.serviceId}/bookings`
                ),
                updatedBookings
              );
            }
          });
        })
        .catch((error) => {
          console.error("Error removing appointment: ", error);
        });
      setConfirmationDialogOpen(false);
    }
  };

  const handleDeleteService = (serviceId, ownerId) => {
    // References to the necessary database paths
    const serviceRef = ref(database, `services/${serviceId}`);
    const appointmentsRef = ref(database, "appointments");
    const userServicesRef = ref(
      database,
      `users/${ownerId}/businessDetails/servicesOffered`
    );

    // Remove the service from the services database
    remove(serviceRef)
      .then(() => {
        console.log("Service removed successfully");

        // Update the services offered by the business owner
        transaction(
          userServicesRef,
          (currentServices) => {
            if (currentServices) {
              const updatedServices = currentServices.filter(
                (id) => id !== serviceId
              );
              return updatedServices; // This will be the new value of `servicesOffered`.
            } else {
              // If `currentServices` is `null` or `undefined`, we should return `undefined` to abort the transaction.
              return;
            }
          },
          (error, committed) => {
            if (error) {
              console.error(
                "Transaction failed to update servicesOffered for the owner:",
                error
              );
            } else if (!committed) {
              console.log("Transaction aborted for updating servicesOffered");
            } else {
              console.log(
                "Business owner's servicesOffered updated successfully"
              );
            }
          }
        );

        // Remove all related appointments
        onValue(
          appointmentsRef,
          (snapshot) => {
            const allAppointments = snapshot.val();
            Object.keys(allAppointments).forEach((appointmentId) => {
              const appointment = allAppointments[appointmentId];
              if (appointment.serviceId === serviceId) {
                remove(ref(database, `appointments/${appointmentId}`))
                  .then(() =>
                    console.log(
                      `Appointment ${appointmentId} deleted successfully.`
                    )
                  )
                  .catch((error) =>
                    console.error(
                      `Failed to delete appointment ${appointmentId}:`,
                      error
                    )
                  );

                // Remove appointment from the user's appointments array
                const userRef = ref(
                  database,
                  `users/${appointment.userId}/appointments`
                );
                transaction(
                  userRef,
                  (currentAppointments) => {
                    if (currentAppointments) {
                      const updatedAppointments = currentAppointments.filter(
                        (id) => id !== appointmentId
                      );
                      return updatedAppointments; // This will be the new value of the user's appointments.
                    } else {
                      // If `currentAppointments` is `null` or `undefined`, we abort the transaction.
                      return;
                    }
                  },
                  (error, committed) => {
                    if (error) {
                      console.error(
                        "Transaction failed to update user's appointments:",
                        error
                      );
                    } else if (!committed) {
                      console.log(
                        "Transaction aborted for updating user's appointments"
                      );
                    } else {
                      console.log(
                        `User's appointments updated successfully for user ID: ${appointment.userId}`
                      );
                    }
                  }
                );
              }
            });
          },
          { onlyOnce: true }
        );

        // Update local state
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== serviceId)
        );
      })
      .catch((error) => {
        console.error("Failed to delete service: ", error);
      });
  };

  const openConfirmationDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setConfirmationDialogOpen(true);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={6} sx={paperStyle}>
        {user && userData ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                {profileImageUrl && (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "5px solid #505050",
                      marginRight: "20px",
                    }}
                  >
                    <Link to="/profile">
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                  </div>
                )}
                <Typography variant="h6" gutterBottom>
                  Hello, {userData.profile.name}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>
                  <Typography variant="body1" align="center" gutterBottom>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    <strong>User Type:</strong>{" "}
                    {userData.profile.type === "business_owner"
                      ? "Business Owner"
                      : userData.profile.type === "customer"
                      ? "Customer"
                      : userData.profile.type}
                  </Typography>
                  {userData.profile.type === "business_owner" && (
                    <>
                      <Typography variant="body1" align="center" gutterBottom>
                        <strong>Business Name:</strong>{" "}
                        {userData.businessDetails.businessName}
                      </Typography>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={buttonStyle}
                          onClick={goToCreateServicePage}
                        >
                          Create Service
                        </Button>
                      </div>
                      <Typography variant="h6" align="center" gutterBottom>
                        Services Offered:
                      </Typography>
                      {services.length > 0 ? (
                        services.map((service, index) => (
                          <Accordion key={index} sx={{ marginBottom: "10px" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography>{service.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List>
                                <ListItem>
                                  <ListItemText
                                    primary={`Price: $${service.price}`}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={`Category: ${service.category}`}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary={`Users signed up: ${
                                      service.bookings
                                        ? service.bookings.length
                                        : 0
                                    }`}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText primary="Booked Users:" />
                                  {service.bookings &&
                                    service.bookings.map((booking, index) => (
                                      <ListItem key={index}>
                                        <ListItemText
                                          primary={`User: ${booking.userName}, Date: ${booking.date}, Time: ${booking.time}`}
                                        />
                                      </ListItem>
                                    ))}
                                  <Button
                                    color="error"
                                    onClick={() => openDeleteDialog(service.id)}
                                  >
                                    Delete Service
                                  </Button>
                                </ListItem>
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      ) : (
                        <Typography variant="body1" align="center">
                          No services offered.
                        </Typography>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <Typography variant="h6" align="center" gutterBottom>
              Appointments:
            </Typography>
            <List>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Service: ${appointment.serviceName}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Date: {appointment.date}, Time: {appointment.time}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Provider: {appointment.provider}
                          </Typography>
                        </>
                      }
                    />
                    <Button onClick={() => openConfirmationDialog(appointment)}>
                      Unbook
                    </Button>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" align="center">
                  No appointments booked.
                </Typography>
              )}
            </List>
          </>
        ) : (
          <Typography variant="body1" align="center">
            No user data available. Please <Link to="/login">log in</Link>.
          </Typography>
        )}
      </Paper>

      {/* Confirmation Dialog for Unbooking */}
      <Dialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
      >
        <DialogTitle>Confirm Unbooking</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to unbook this appointment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUnbookAppointment} autoFocus>
            Unbook
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Service Deletion */}
      <Dialog open={deleteConfirmOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this service?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDeleteService} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfilePage;
