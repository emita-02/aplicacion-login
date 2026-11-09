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
    'mb-5 rounded-xl border border-taskdo-gray px-4 py-3 text-taskdo-brown';

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
        <View className="max-h-[90%] rounded-t-[28px] bg-taskdo-blue px-5 pb-8 pt-6">
          <ScrollView keyboardShouldPersistTaps="handled">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-taskdo-brown">
                {initialTask ? 'Editar tarea' : 'Nueva tarea'}
              </Text>

              <Pressable onPress={onClose} disabled={isSaving}>
                <Text className="font-semibold text-taskdo-brown">
                  Cerrar
                </Text>
              </Pressable>
            </View>

            <Text className="mb-2 font-semibold text-taskdo-brown">
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

            <Text className="mb-2 font-semibold text-taskdo-brown">
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
              className="mb-5 min-h-[90px] rounded-xl border border-taskdo-gray px-4 py-3 text-taskdo-brown"
            />

            <Text className="mb-2 font-semibold text-taskdo-brown">
              Fecha programada *
            </Text>

            <TextInput
              value={taskDate}
              onChangeText={setTaskDate}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#7A706D"
              keyboardType="numbers-and-punctuation"
              className={inputClass}
            />

            <Text className="mb-2 font-semibold text-taskdo-brown">
              Hora programada *
            </Text>

            <TextInput
              value={taskTime}
              onChangeText={setTaskTime}
              placeholder="HH:mm"
              placeholderTextColor="#7A706D"
              keyboardType="numbers-and-punctuation"
              className={inputClass}
            />

            {initialTask ? (
              <View className="mb-6 flex-row items-center justify-between rounded-xl bg-taskdo-cream p-4">
                <View className="flex-1">
                  <Text className="font-bold text-taskdo-brown">
                    Estado de la tarea
                  </Text>
                  <Text className="mt-1 text-sm text-taskdo-brown">
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

            <Pressable
              onPress={handleSubmit}
              disabled={isSaving}
              className={`items-center rounded-xl py-4 ${
                isSaving ? 'bg-taskdo-gray' : 'bg-taskdo-brown'
              }`}
            >
              <Text className="font-bold text-white">
                {isSaving
                  ? 'Guardando...'
                  : initialTask
                    ? 'Guardar cambios'
                    : 'Crear tarea'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}