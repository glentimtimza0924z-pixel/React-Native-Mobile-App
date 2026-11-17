import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';
import { CustomButton } from '../components/CustomButton';
import { Badge } from '../components/Badge';
import { SectionHeader } from '../components/SectionHeader';

export const ProfileScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { profile, stats } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Pair Roster & Profile</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Collaboration team for Mobile Computing final requirement
          </Text>
        </View>

        {/* Academic Course Card */}
        <CustomCard style={styles.courseCard} padding={14}>
          <View style={styles.courseHeader}>
            <View style={{ flex: 1, paddingRight: 6 }}>
              <Text style={[styles.courseTitle, { color: theme.text }]}>
                {profile.course}
              </Text>
              <Text style={[styles.courseSection, { color: theme.primary }]}>
                {profile.section} • {profile.academicYear}
              </Text>
            </View>
            <Badge label="Active Term" variant="success" size="sm" />
          </View>
          <View
            style={[
              styles.courseDivider,
              { borderTopColor: theme.border },
            ]}
          >
            <Text style={[styles.courseFooterLabel, { color: theme.textMuted }]}>
              Compilation Progress:
            </Text>
            <Text style={[styles.courseFooterValue, { color: theme.text }]}>
              {stats.total === 0
                ? '0 Activities • Ready for Compilation'
                : `${stats.completed}/${stats.total} Completed (${stats.percentage}%)`}
            </Text>
          </View>
        </CustomCard>

        {/* Pair Members Section */}
        <SectionHeader
          title="Team Members (By Pair)"
          subtitle="Assigned collaborators for course evaluation"
          actionText="Edit in Settings"
          onActionPress={() => navigation.navigate('Settings')}
        />

        {profile.pair.map((member, index) => (
          <CustomCard key={member.id} style={styles.memberCard} padding={14}>
            <View style={styles.memberTopRow}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: theme.surfaceAlt },
                ]}
              >
                <Text style={styles.avatarText}>{member.avatar}</Text>
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.partnerTagRow}>
                  <Badge
                    label={`Partner ${index + 1}`}
                    variant={index === 0 ? 'primary' : 'info'}
                    size="sm"
                  />
                  <Text style={[styles.studentId, { color: theme.textMuted }]}>
                    {member.studentId}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[styles.memberName, { color: theme.text }]}
                >
                  {member.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.memberRole, { color: theme.primary }]}
                >
                  {member.role}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.contributionBox,
                { backgroundColor: theme.surfaceAlt },
              ]}
            >
              <Text style={[styles.contributionLabel, { color: theme.textMuted }]}>
                Core Responsibility:
              </Text>
              <Text
                style={[
                  styles.contributionText,
                  { color: theme.textSecondary },
                ]}
              >
                {member.contribution}
              </Text>
            </View>
          </CustomCard>
        ))}

        {/* Edit in Settings Button */}
        <CustomButton
          title="Edit Pair & Settings"
          variant="outline"
          size="md"
          fullWidth
          onPress={() => navigation.navigate('Settings')}
          style={{ marginTop: 8, marginBottom: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  courseCard: {
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  courseSection: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  courseDivider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  courseFooterLabel: {
    fontSize: 11,
  },
  courseFooterValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  memberCard: {
    marginBottom: 12,
  },
  memberTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 26,
  },
  memberInfo: {
    flex: 1,
  },
  partnerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 10,
    marginLeft: 6,
    fontWeight: '500',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberRole: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  contributionBox: {
    padding: 10,
    borderRadius: 8,
  },
  contributionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  contributionText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
