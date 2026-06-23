# Property Bottom Sheet

Bottom sheet hiển thị thông tin chi tiết khi người dùng **nhấn giữ (long-press)** vào một property card. Component được tối ưu riêng cho từng nền tảng để mang lại trải nghiệm gần với native nhất.

## Demo

### iOS

Trên iOS, bottom sheet sử dụng nền **frosted glass** (mờ kính) tương tự `UISheetPresentationController` / SwiftUI sheet và tự động lùi vào vùng home indicator.

![iOS Demo](./assets/images/ios-demo.png)

### Android

Trên Android, bottom sheet sử dụng **solid surface** cùng shadow từ `elevation`, đồng thời tôn trọng vùng navigation bar insets.

![Android Demo](./assets/images/android-demo.png)

## Cài đặt dependencies

Component sử dụng các thư viện sau:

```bash
npx expo install expo-blur react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-worklets
```

> Lưu ý: `react-native-reanimated` và `react-native-gesture-handler` cần được cấu hình plugin trong `babel.config.js` và `react-native-worklets` cần được setup theo hướng dẫn chính thức.

## API

```tsx
import { PropertyBottomSheet } from "@/components/bottom-sheet/property-bottom-sheet";
```

### Props

| Prop       | Type         | Required | Mô tả                                                             |
| ---------- | ------------ | -------- | ----------------------------------------------------------------- |
| `visible`  | `boolean`    | ✅       | Trạng thái hiển thị của bottom sheet                              |
| `onClose`  | `() => void` | ✅       | Callback khi bottom sheet cần đóng (kéo xuống hoặc vuốt đủ nhanh) |
| `children` | `ReactNode`  | ❌       | Nội dung bên trong bottom sheet                                   |

## Ví dụ sử dụng

```tsx
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { PropertyBottomSheet } from "@/components/bottom-sheet/property-bottom-sheet";

export function PropertyCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        onLongPress={() => setIsOpen(true)}
        style={{ padding: 16, backgroundColor: "#f2f2f2", borderRadius: 12 }}
      >
        <Text>Nhấn giữ vào property card</Text>
      </Pressable>

      <PropertyBottomSheet visible={isOpen} onClose={() => setIsOpen(false)}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Tên bất động sản
        </Text>
        <Text>Địa chỉ: Quận 1, TP.HCM</Text>
        <Text>Giá: 5 tỷ VNĐ</Text>
      </PropertyBottomSheet>
    </>
  );
}
```

## Chi tiết nền tảng

### iOS

- **Frosted glass background**: Sử dụng `BlurView` từ `expo-blur` với `intensity={90}` kết hợp lớp overlay màu trắng / đen mờ để tạo hiệu ứng kính mờ gần giống native sheet.
- **Home indicator**: `useSafeAreaInsets()` được dùng để `paddingBottom` lùi vào vùng home indicator, tránh nội dung bị che.
- **Animation**: Mở bằng spring, đóng bằng timing với cubic easing.

### Android

- **Solid surface**: Sử dụng `View` với màu nền thay vì blur, vì blur không được hỗ trợ tốt trên Android.
- **Elevation shadow**: Áp dụng `elevation: 24` cùng `shadowColor` để tạo bóng nổi rõ ràng.
- **Navigation bar insets**: `useSafeAreaInsets()` giúp nội dung không bị đè lên navigation bar (cả gesture navigation lẫn 3-button navigation).

## Hành vi tương tác

- **Kéo xuống**: Vuốt từ trên xuống để đóng sheet.
- **Ngưỡng đóng**: Sheet tự động đóng khi kéo xuống hơn **25% chiều cao** hoặc vận tốc vuốt xuống lớn hơn **700**.
- **Bounce nhẹ**: Khi kéo lên trên đầu, sheet có hiệu ứng bật nhẹ (`Math.max(-8, nextY)`).

## Lưu ý

- Component render ở `zIndex: 100`, nên cần đảm bảo parent container không bị cắt bởi `overflow: "hidden"` nếu muốn sheet hiển thị đúng.
- Chiều cao sheet mặc định là **55% chiều cao màn hình**, tối đa **420px**.
- Tự động hỗ trợ dark mode dựa trên `useColorScheme()`.
