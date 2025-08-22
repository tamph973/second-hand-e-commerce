import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import AddressForm from './AddressForm';

const AddAddressModal = ({ isOpen, onClose, onSuccess }) => {
	const handleSuccess = useCallback(() => {
		onSuccess?.();
		onClose();
	}, [onSuccess, onClose]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Địa chỉ của tôi'
			size='2xl'
			variant='form'
			showCloseButton={true}
			closeOnOverlayClick={false}>
			<AddressForm onSuccess={handleSuccess} onCancel={onClose} />
		</Modal>
	);
};

AddAddressModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func,
};

export default AddAddressModal;
