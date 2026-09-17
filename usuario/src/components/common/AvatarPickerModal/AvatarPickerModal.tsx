import { Modal, Avatar } from 'antd';
import { UserOutlined, CheckOutlined } from '@ant-design/icons';
import { useUser } from '../../../hooks/useUser';
import { AVATAR_OPTIONS } from '../../../data/avatars';

interface AvatarPickerModalProps {
  open: boolean;
  onClose: () => void;
}

function AvatarPickerModal({ open, onClose }: AvatarPickerModalProps) {
  const { avatarId, setAvatarId } = useUser();

  function handleSelect(id: string) {
    setAvatarId(id);
    onClose();
  }

  return (
    <Modal
      title="Escolha seu avatar"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <p className="mb-4 text-sm text-gray-500">
        Avatares temporários — em breve teremos as ilustrações exclusivas do
        Vac+.
      </p>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {AVATAR_OPTIONS.map((avatar) => {
          const isSelected = avatar.id === avatarId;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => handleSelect(avatar.id)}
              aria-label={`Selecionar ${avatar.id}`}
              className={`relative flex items-center justify-center rounded-full ${
                isSelected ? 'ring-2 ring-emerald-600 ring-offset-2' : ''
              }`}
            >
              <Avatar
                size={56}
                icon={<UserOutlined />}
                style={{ backgroundColor: avatar.color }}
              />
              {isSelected && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckOutlined className="text-xs" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

export default AvatarPickerModal;
