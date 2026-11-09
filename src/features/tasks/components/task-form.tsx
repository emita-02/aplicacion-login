import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { NewTask } from '../types/task';

type TaskFormProps = {
  visible: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask) => Promise<void>;
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
  onClose,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskDate, setTaskDate] = useState(getCurrentDate());
  const [taskTime, setTaskTime] = useState('09:00');

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
        'Ingresa una fecha con formato AAAA-MM-DD y una hora con formato HH:mm.'
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
    });

    setTitle('');
    setDescription('');
    setTaskDate(getCurrentDate());
    setTaskTime('09:00');
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
        <View className="max-h-[90%] rounded-t-[28px] bg-white px-5 pb-8 pt-6">
          <ScrollView keyboardShouldPersistTaps="handled">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-taskdo-brown">
                Nueva tarea
              </Text>

              <Pressable onPress={onClose} disabled={isSaving}>
                <Text className="text-base font-semibold text-taskdo-brown">
                  Cerrar
                </Text>
              </Pressable>
            </View>

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
              Título *
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ej. Estudiar para el examen"
              placeholderTextColor="#7A706D"
              maxLength={100}
              className="mb-5 rounded-xl border border-taskdo-gray px-4 py-3 text-taskdo-brown"
            />

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
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

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
              Fecha *
            </Text>

            <TextInput
              value={taskDate}
              onChangeText={setTaskDate}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#7A706D"
              keyboardType="numbers-and-punctuation"
              className="mb-5 rounded-xl border border-taskdo-gray px-4 py-3 text-taskdo-brown"
            />

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
              Hora *
            </Text>

            <TextInput
              value={taskTime}
              onChangeText={setTaskTime}
              placeholder="HH:mm"
              placeholderTextColor="#7A706D"
              keyboardType="numbers-and-punctuation"
              className="mb-6 rounded-xl border border-taskdo-gray px-4 py-3 text-taskdo-brown"
            />

            <Pressable
              onPress={handleSubmit}
              disabled={isSaving}
              className={`items-center rounded-xl py-4 ${
                isSaving ? 'bg-taskdo-gray' : 'bg-taskdo-brown'
              }`}
            >
              <Text className="font-bold text-white">
                {isSaving ? 'Guardando...' : 'Guardar tarea'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}