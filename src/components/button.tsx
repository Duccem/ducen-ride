import { ButtonProps } from '@/types/type';
import { Text, TouchableOpacity } from 'react-native';

const getBgVariantStyle = (bgVariant: ButtonProps['bgVariant']) => {
  switch (bgVariant) {
    case 'primary':
      return 'bg-primary-500';
    case 'secondary':
      return 'bg-gray-500';
    case 'danger':
      return 'bg-red-500';
    case 'success':
      return 'bg-green-500';
    case 'outline':
      return 'bg-transparent border-[0.5px] border-neutral-300';
    default:
      return 'bg-[#0286FF]';
  }
};

const getTextVariantStyle = (textVariant: ButtonProps['textVariant']) => {
  switch (textVariant) {
    case 'primary':
      return 'text-black';
    case 'secondary':
      return 'text-gray-100';
    case 'danger':
      return 'text-red-100';
    case 'success':
      return 'text-green-100';
    default:
      return 'text-white';
  }
};

const Button = ({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...props}
      className={`w-full rounded-full flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 p-3 ${getBgVariantStyle(
        bgVariant
      )} ${className}`}
    >
      {IconLeft && <IconLeft />}
      <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>{title}</Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default Button;
