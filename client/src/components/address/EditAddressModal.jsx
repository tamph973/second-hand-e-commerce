import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import AddressForm from './AddressForm';

const EditAddressModal = ({ isOpen, onClose, addressData, onSuccess }) => {
	const handleSuccess = useCallback(() => {
		onSuccess?.();
		onClose();
	}, [onSuccess, onClose]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Chỉnh sửa địa chỉ'
			size='2xl'
			variant='form'
			showCloseButton={true}
			closeOnOverlayClick={false}>
			<AddressForm
				onSuccess={handleSuccess}
				onCancel={onClose}
				initialValues={addressData}
				isEdit={true}
			/>
		</Modal>
	);
};

EditAddressModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	addressData: PropTypes.object,
	onSuccess: PropTypes.func,
};

EditAddressModal.defaultProps = {
	addressData: null,
};

export default EditAddressModal;
