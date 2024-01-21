import React, { useState, useEffect } from "react";

const Problem2 = () => {
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyEven, setOnlyEven] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchContacts = async (countryNameParams = "", page = 1) => {
    console.log(countryNameParams);
    try {
      let apiUrl;

      if (searchQuery !== "") {
        apiUrl`https://contact.mediusware.com/api/country-contacts/${searchQuery}/?page=${page}&page_size=20`;
      } else if (countryNameParams !== "") {
        apiUrl = `https://contact.mediusware.com/api/country-contacts/${countryNameParams}/?page=${page}&page_size=20`;
      } else {
        apiUrl = `https://contact.mediusware.com/api/contacts/?page=${page}&page_size=20`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      setContacts((prevContacts) =>
        page === 1 ? data.results : [...prevContacts, ...data.results]
      );
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setShowModal(true);
    setCurrentPage(1);
    if (type === "All Contacts") {
      fetchContacts();
    } else if (type === "US Contacts") {
      fetchContacts("United States", currentPage);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCheckboxChange = () => {
    setOnlyEven((prevValue) => !prevValue);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset page when initiating a new search
    fetchContacts(modalType === "US Contacts" ? "United States" : "");
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleContactClick = (contact) => {
    // Open details modal or perform other actions
    console.log("Contact clicked:", contact);
  };

  useEffect(() => {
    console.log(modalType === "US Contacts");
    if (showModal) {
      fetchContacts(
        modalType === "US Contacts" ? "United States" : "",
        currentPage
      );
    }
  }, [currentPage, showModal]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={() => handleModalOpen("All Contacts")}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => handleModalOpen("US Contacts")}
          >
            US Contacts
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", overflow: "scroll" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{modalType}</h3>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </div>
              <div className="modal-body">
                <div>
                  {modalType !== "US Contacts" && (
                    <div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search..."
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                    </div>
                  )}

                  <label className="ml-2">
                    Only even
                    <input
                      type="checkbox"
                      checked={onlyEven}
                      onChange={handleCheckboxChange}
                    />
                  </label>
                </div>
                <ul>
                  {contacts.map((contact, Index) => (
                    <li
                      key={Index}
                      onClick={() => handleContactClick(contact)}
                      className="cursor-pointer"
                    >
                      {contact.country.name}
                      <p>{contact.country.id}</p>
                    </li>
                  ))}
                </ul>

                
                <button className="btn btn-success" onClick={handleLoadMore}>
                  Load More
                </button>
                <button className="btn btn-danger" onClick={handleModalClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem2;
