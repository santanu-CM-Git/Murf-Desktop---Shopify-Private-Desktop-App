import { useState } from 'react';

const useModalDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsOpen(true);

  // Function to close the modal
  const closeModal = () => setIsOpen(false);

  // Function to toggle the modal state
  const toggleModal = () => setIsOpen(prev => !prev);

  return { isOpen, openModal, closeModal, toggleModal };
};

export default useModalDialog;
