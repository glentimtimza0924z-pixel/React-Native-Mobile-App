import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { PRESET_CATEGORIES } from '../constants/labsData';

const STATUS_FILTERS = ['All', 'Completed', 'In Progress', 'Pending'];
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

export const LabsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { labs, addLab, deleteLab, toggleLabStatus, stats } = useApp();

  // Search & Filter local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal local state for adding new labs dynamically
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(PRESET_CATEGORIES[0]);
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');
  const [newDueDate, setNewDueDate] = useState('');
  const [titleError, setTitleError] = useState('');

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchesSearch =
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.number.includes(searchQuery) ||
        lab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' ? true : lab.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [labs, searchQuery, selectedStatus]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleOpenModal = () => {
    setNewTitle('');
    setNewCategory(PRESET_CATEGORIES[0]);
    setNewDescription('');
    setNewStatus('Pending');
    setNewDueDate('');
    setTitleError('');
    setIsModalVisible(true);
  };

  const handleSaveLab = () => {
    if (!newTitle.trim()) {
      setTitleError('Please enter a laboratory title');
      return;
    }

    addLab({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      status: newStatus,
      dueDate: newDueDate.trim() || 'Current Term',
    });

    setIsModalVisible(false);
  };

  const confirmDelete = (lab) => {
    Alert.alert(
      'Delete Laboratory Activity',
      `Are you sure you want to remove "${lab.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteLab(lab.id),
        },
      ]
    );
  };

  const renderLabItem = ({ item }) => (
    <CustomCard
      onPress={() => navigation.navigate('LabDetail', { lab: item })}
      style={styles.card}
      padding={14}
    >
      <View style={styles.cardHeader}>
        <View style={styles.numberAndTitle}>
          <Text style={[styles.labNumberBadge, { color: theme.primary }]}>
            ACTIVITY #{item.number}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.labTitle, { color: theme.text }]}
          >
            {item.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleLabStatus(item.id)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Badge label={item.status} variant={item.status} />
        </TouchableOpacity>
      </View>

      <Text
        numberOfLines={2}
        style={[styles.labDescription, { color: theme.textSecondary }]}
      >
        {item.description}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[styles.categoryText, { color: theme.textMuted }]}>
          📁 {item.category} • Due: {item.dueDate}
        </Text>
        <Text style={[styles.scoreText, { color: theme.primary }]}>
          {item.score}
        </Text>
      </View>

      {/* CRUD Action Buttons */}
      <View
        style={[
          styles.actionDivider,
          { borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleLabStatus(item.id)}
        >
          <Text style={[styles.actionBtnText, { color: theme.textSecondary }]}>
            🔄 Cycle Status
          </Text>
        </TouchableOpacity>

        <View style={styles.rightActionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { marginRight: 12 }]}
            onPress={() => confirmDelete(item)}
          >
            <Text style={[styles.deleteBtnText, { color: theme.danger }]}>
              🗑️ Delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('LabDetail', { lab: item })}
          >
            <Text style={[styles.actionBtnTextBold, { color: theme.primary }]}>
              Open →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomCard>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.container}>
        {/* Header Bar with Title & Add Button */}
        <View style={styles.topHeader}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={[styles.screenTitle, { color: theme.text }]}>
              Laboratory Directory
            </Text>
            <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
              {stats.total === 0
                ? 'No activities registered yet'
                : `${stats.total} total activities • ${stats.completed} completed (${stats.percentage}%)`}
            </Text>
          </View>
          <CustomButton
            title="+ Add Lab"
            variant="primary"
            size="sm"
            onPress={handleOpenModal}
          />
        </View>

        {/* Search Bar */}
        <CustomInput
          placeholder="Search by title, number, or category..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Text style={{ fontSize: 16 }}>🔍</Text>}
          style={{ marginBottom: 6 }}
        />

        {/* Status Filter Chips */}
        <View style={styles.statusFilters}>
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? theme.primary
                      : theme.surfaceAlt,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic List of Labs */}
        <FlatList
          data={filteredLabs}
          keyExtractor={(item) => item.id}
          renderItem={renderLabItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <EmptyState
              icon="📝"
              title={
                searchQuery || selectedStatus !== 'All'
                  ? 'No matching activities'
                  : 'No Laboratory Activities Added'
              }
              message={
                searchQuery || selectedStatus !== 'All'
                  ? 'Try modifying your search query or status filter.'
                  : 'Start compiling your coursework by adding your first laboratory activity.'
              }
              actionLabel={
                searchQuery || selectedStatus !== 'All'
                  ? 'Reset Filter'
                  : '+ Add First Lab'
              }
              onActionPress={
                searchQuery || selectedStatus !== 'All'
                  ? () => {
                      setSearchQuery('');
                      setSelectedStatus('All');
                    }
                  : handleOpenModal
              }
            />
          }
        />

        {/* ADD NEW LAB MODAL */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                {/* Modal Header */}
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    Add New Laboratory
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Text style={{ fontSize: 18, color: theme.textMuted }}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Title Input */}
                <CustomInput
                  label="Activity Title *"
                  placeholder="e.g. Lab 01: Flutter vs React Native Layouts"
                  value={newTitle}
                  onChangeText={(text) => {
                    setNewTitle(text);
                    if (titleError) setTitleError('');
                  }}
                  error={titleError}
                  leftIcon={<Text>🏷️</Text>}
                />

                {/* Category Preset Selector */}
                <View style={styles.categorySection}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    Category:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryPillsRow}
                  >
                    {PRESET_CATEGORIES.map((cat) => {
                      const isCatActive = newCategory === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setNewCategory(cat)}
                          style={[
                            styles.modalCategoryChip,
                            {
                              backgroundColor: isCatActive
                                ? theme.primary
                                : theme.surfaceAlt,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: isCatActive ? '#FFFFFF' : theme.textSecondary,
                              fontSize: 11,
                              fontWeight: isCatActive ? '700' : '500',
                            }}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Status Selector */}
                <View style={styles.statusSection}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    Initial Status:
                  </Text>
                  <View style={styles.statusOptionsRow}>
                    {STATUS_OPTIONS.map((st) => {
                      const isStActive = newStatus === st;
                      return (
                        <TouchableOpacity
                          key={st}
                          onPress={() => setNewStatus(st)}
                          style={[
                            styles.modalStatusChip,
                            {
                              backgroundColor: isStActive
                                ? theme.primary
                                : theme.surfaceAlt,
                              borderColor: isStActive
                                ? theme.primary
                                : theme.border,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: isStActive ? '#FFFFFF' : theme.text,
                              fontSize: 12,
                              fontWeight: isStActive ? '700' : '500',
                            }}
                          >
                            {st}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Description Input */}
                <CustomInput
                  label="Description / Deliverable Notes"
                  placeholder="Summary of laboratory objectives and deliverables..."
                  value={newDescription}
                  onChangeText={setNewDescription}
                  multiline={true}
                  numberOfLines={3}
                  leftIcon={<Text>📄</Text>}
                />

                {/* Due Date / Milestone Input */}
                <CustomInput
                  label="Milestone / Due Date"
                  placeholder="e.g. Week 4 or Prelims"
                  value={newDueDate}
                  onChangeText={setNewDueDate}
                  leftIcon={<Text>📅</Text>}
                />

                {/* Action Buttons */}
                <View style={styles.modalActionRow}>
                  <CustomButton
                    title="Cancel"
                    variant="secondary"
                    size="md"
                    onPress={() => setIsModalVisible(false)}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <CustomButton
                    title="Save Lab"
                    variant="primary"
                    size="md"
                    onPress={handleSaveLab}
                    style={{ flex: 1 }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  statusFilters: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 2,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 11,
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  numberAndTitle: {
    flex: 1,
    paddingRight: 6,
  },
  labNumberBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  labTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  labDescription: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionDivider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtnTextBold: {
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  categorySection: {
    marginVertical: 4,
  },
  categoryPillsRow: {
    paddingVertical: 2,
  },
  modalCategoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 6,
  },
  statusSection: {
    marginVertical: 6,
  },
  statusOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalStatusChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  modalActionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
});
