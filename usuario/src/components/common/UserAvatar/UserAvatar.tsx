import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUser } from '../../../hooks/useUser';
import { AVATAR_OPTIONS } from '../../../data/avatars';

interface UserAvatarProps {
  size?: number;
}

// Mostra o avatar escolhido pelo usuário, ou a primeira letra do nome
// enquanto nenhum avatar tiver sido escolhido ainda. Como os dados vêm
// do UserContext, o Header e a aba Profile de Settings sempre mostram
// exatamente o mesmo avatar.
function UserAvatar({ size = 36 }: UserAvatarProps) {
  const { userName, avatarId } = useUser();

  const selectedAvatar = AVATAR_OPTIONS.find(
    (avatar) => avatar.id === avatarId,
  );
  const initial = userName.trim().charAt(0).toUpperCase() || '?';

  if (selectedAvatar) {
    return (
      <Avatar
        size={size}
        icon={<UserOutlined />}
        style={{ backgroundColor: selectedAvatar.color }}
      />
    );
  }

  return (
    <Avatar
      size={size}
      style={{ backgroundColor: '#a7f3d0', color: '#022c22' }}
    >
      {initial}
    </Avatar>
  );
}

export default UserAvatar;
