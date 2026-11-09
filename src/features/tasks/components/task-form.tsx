
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { NewTask, Task } from '../types/task';
import {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

type TaskFormProps = {
  visible: boolean;
  isSaving: boolean;
  initialTask: Task | null;
  onClose: () => void;
  onSubmit: (task: NewTask & { is_completed: boolean }) => Promise<void>;
};

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function TaskForm({
  visible,
  isSaving,
  initialTask,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(
    initialTask?.description ?? ''
  );
  const [taskDate, setTaskDate] = useState(
    initialTask?.task_date ?? getCurrentDate()
  );
  const [taskTime, setTaskTime] = useState(
    initialTask?.task_time?.slice(0, 5) ?? '09:00'
  );
  const [isCompleted, setIsCompleted] = useState(
    initialTask?.is_completed ?? false
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Campo obligatorio', 'Ingresa el título de la tarea.');
      return;
    }

    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(taskDate);
    const validTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(taskTime);

    if (!validDate || !validTime) {
      Alert.alert(
        'Datos incorrectos',
        'Ingresa una fecha AAAA-MM-DD y una hora HH:mm.'
      );
      return;
    }

    const [year, month, day] = taskDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      Alert.alert('Fecha incorrecta', 'Ingresa una fecha válida.');
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      task_date: taskDate,
      task_time: `${taskTime}:00`,
      is_completed: isCompleted,
    });
  };

  const inputClass =
    'rounded-xl border border-taskdo-gray bg-white px-3.5 py-3 text-sm text-taskdo-brown';

  const labelClass =
    'mb-1.5 text-[10px] font-bold uppercase tracking-wider text-taskdo-brown';

    const showDatePicker = () => {
    const [year, month, day] = taskDate.split('-').map(Number);

    const currentDate = new Date(year, month - 1, day);

    DateTimePickerAndroid.open({
      value: currentDate,
      mode: 'date',
      display: 'calendar',
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
          const day = String(selectedDate.getDate()).padStart(2, '0');

          setTaskDate(`${year}-${month}-${day}`);
        }
      },
    });
  };

  const showTimePicker = () => {
    const [year, month, day] = taskDate.split('-').map(Number);
    const [hours, minutes] = taskTime.split(':').map(Number);

    const currentTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes
    );

    DateTimePickerAndroid.open({
      value: currentTime,
      mode: 'time',
      display: 'clock',
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (event.type === 'set' && selectedTime) {
          const hours = String(selectedTime.getHours()).padStart(2, '0');
          const minutes = String(selectedTime.getMinutes()).padStart(2, '0');

          setTaskTime(`${hours}:${minutes}`);
        }
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <View className="max-h-[90%] rounded-t-[28px] border-2 border-taskdo-brown bg-taskdo-blue px-5 pb-8 pt-5">
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Encabezado */}
            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-taskdo-brown">
                  <Text className="text-2xl text-taskdo-cream">
                    {initialTask ? '✎' : '+'}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-xl font-bold text-taskdo-brown">
                    {initialTask ? 'Editar tarea' : 'Nueva tarea'}
                  </Text>

                  <Text className="mt-0.5 text-[11px] text-taskdo-brown/70">
                    {initialTask
                      ? 'Modifica los detalles de tu actividad'
                      : 'Organiza una nueva actividad'}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={onClose}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel="Cerrar formulario"
                className="h-9 w-9 items-center justify-center rounded-full bg-taskdo-cream"
              >
                <Text className="text-lg font-bold text-taskdo-brown">
                  ×
                </Text>
              </Pressable>
            </View>

            {/* Título */}
            <View className="mb-4">
              <Text className={labelClass}>
                Título *
              </Text>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ej. Estudiar para el examen"
                placeholderTextColor="#7A706D"
                maxLength={100}
                className={inputClass}
              />
            </View>

            {/* Descripción */}
            <View className="mb-4">
              <Text className={labelClass}>
                Descripción
              </Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Agrega detalles sobre tu tarea..."
                placeholderTextColor="#7A706D"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="min-h-[85px] rounded-xl border border-taskdo-gray bg-white px-3.5 py-3 text-sm text-taskdo-brown"
              />
            </View>

            {/* Fecha y hora */}
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <Text className={labelClass}>
                  Fecha *
                </Text>

                <Pressable
                  onPress={showDatePicker}
                  accessibilityRole="button"
                  accessibilityLabel="Seleccionar fecha"
                  className={`${inputClass} flex-row items-center justify-between`}
                >
                  <Text className="text-sm text-taskdo-brown">
                    {taskDate}
                  </Text>

                  <Text className="text-lg text-taskdo-brown">
                    𝄜
                  </Text>
                </Pressable>
              </View>

              <View className="flex-1">
                <Text className={labelClass}>
                  Hora *
                </Text>

                <Pressable
                  onPress={showTimePicker}
                  accessibilityRole="button"
                  accessibilityLabel="Seleccionar hora"
                  className={`${inputClass} flex-row items-center justify-between`}
                >
                  <Text className="text-sm text-taskdo-brown">
                    {taskTime}
                  </Text>

                  <Text className="text-lg text-taskdo-brown">
                    ⏲
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Estado: solo al editar */}
            {initialTask ? (
              <View className="mb-5 flex-row items-center justify-between rounded-xl border border-taskdo-brown/10 bg-taskdo-cream p-3.5">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-taskdo-brown">
                    Estado de la tarea
                  </Text>

                  <Text className="mt-1 text-[11px] text-taskdo-brown/70">
                    {isCompleted ? 'Completada' : 'Pendiente'}
                  </Text>
                </View>

                <Switch
                  value={isCompleted}
                  onValueChange={setIsCompleted}
                  trackColor={{
                    false: '#CCD6D6',
                    true: '#684F48',
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ) : null}

            {/* Botones */}
            <View className="mb-2 flex-row gap-3">
              <Pressable
                onPress={onClose}
                disabled={isSaving}
                className="flex-1 items-center justify-center rounded-xl border border-taskdo-brown bg-taskdo-cream py-3.5"
              >
                <Text className="text-xs font-bold text-taskdo-brown">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={isSaving}
                className={`flex-[1.5] items-center justify-center rounded-xl py-3.5 ${
                  isSaving ? 'bg-taskdo-gray' : 'bg-taskdo-brown'
                }`}
              >
                <Text className="text-xs font-bold text-taskdo-cream">
                  {isSaving
                    ? 'Guardando...'
                    : initialTask
                      ? 'Guardar cambios'
                      : 'Crear tarea'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
