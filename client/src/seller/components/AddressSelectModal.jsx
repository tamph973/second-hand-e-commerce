/* eslint-disable react/prop-types */
import React from 'react';
import Modal from '@/components/modal/Modal';
import AddressSelectForm from './AddressSelectForm';

const AddressSelectModal = ({ isOpen, onClose, onSelect, initialValue }) => {
	const handleSelect = (selectedAddress) => {
		onSelect(selectedAddress);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Địa chỉ người bán'
			size='2xl'
			variant='form'
			showCloseButton={true}
			closeOnOverlayClick={false}>
			<AddressSelectForm
				onSelect={handleSelect}
				initialValue={initialValue}
			/>
		</Modal>
	);
};

export default AddressSelectModal;
