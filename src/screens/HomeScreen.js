import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';
import { CustomButton } from '../components/CustomButton';
import { MetricCard } from '../components/MetricCard';
import { Badge } from '../components/Badge';
import { SectionHeader } from '../components/SectionHeader';

export const HomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { profile, pairNames, labs, stats, toggleLabStatus } = useApp();

  const activeFocusLab = labs.find((l) => l.status === 'In Progress') || labs[0];

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
        {/* Top Header / App Branding */}
        <View style={styles.header}>
          <View style={styles.headerTextGroup}>
            <View style={styles.badgeRow}>
              <Text style={[styles.courseBadge, { color: theme.primary }]}>
                {profile.course}
              </Text>
              <Text style={[styles.dotSeparator, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.sectionBadge, { color: theme.secondary }]}>
                {profile.section}
              </Text>
            </View>
            <Text style={[styles.greetingTitle, { color: theme.text }]}>
              DevLab Master
            </Text>
            {/* Live synced Pair Names display */}
            <Text
              numberOfLines={1}
              style={[styles.greetingSubtitle, { color: theme.textSecondary }]}
            >
              👥 {pairNames}
            </Text>
          </View>

          {/* Quick Theme Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleTheme}
            style={[
              styles.themeToggleBtn,
              {
                backgroundColor: theme.surfaceAlt,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={styles.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Global Stats Overview (Real-Time Dynamic Recalculation) */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Total Activities"
              value={stats.total}
              icon="📚"
              accentColor={theme.primary}
              onPress={() => navigation.navigate('Labs')}
            />
            <View style={{ width: 10 }} />
            <MetricCard
              title="Completed"
              value={stats.completed}
              icon="✅"
              accentColor={theme.success}
              onPress={() => navigation.navigate('Labs')}
            />
          </View>
          <View style={[styles.metricsRow, { marginTop: 10 }]}>
            <MetricCard
              title="In Progress"
              value={stats.inProgress}
              icon="⏳"
              accentColor={theme.warning}
              onPress={() => navigation.navigate('Labs')}
            />
            <View style={{ width: 10 }} />
            <MetricCard
              title="Completion Rate"
              value={`${stats.percentage}%`}
              icon="📈"
              accentColor={theme.secondary}
              onPress={() => navigation.navigate('Labs')}
            />
          </View>
        </View>

        {/* Dynamic Requirement Progress Bar */}
        <CustomCard style={styles.progressCard} padding={14}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.text }]}>
              Laboratory Requirement Progress
            </Text>
            <Text style={[styles.progressPercent, { color: theme.primary }]}>
              {stats.total === 0
                ? 'No activities yet'
                : `${stats.completed}/${stats.total} Completed (${stats.percentage}%)`}
            </Text>
          </View>
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: theme.surfaceAlt },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: theme.primary,
                  width: `${stats.percentage}%`,
                },
              ]}
            />
          </View>
        </CustomCard>

        {/* Active Focus Spotlight (When activities are present) */}
        {activeFocusLab ? (
          <View style={styles.section}>
            <SectionHeader
              title="Active Focus"
              subtitle="Latest activity in your compilation"
            />
            <CustomCard
              onPress={() => navigation.navigate('LabDetail', { lab: activeFocusLab })}
              style={styles.featuredCard}
              padding={16}
            >
              <View style={styles.featuredTopRow}>
                <View style={styles.featuredBadgeRow}>
                  <Badge label={`ACTIVITY #${activeFocusLab.number}`} variant="primary" />
                  <View style={{ width: 6 }} />
                  <Badge label={activeFocusLab.status} variant={activeFocusLab.status} />
                </View>
                <Text style={styles.featuredIcon}>{activeFocusLab.icon || '📱'}</Text>
              </View>
              <Text style={[styles.featuredTitle, { color: theme.text }]}>
                {activeFocusLab.title}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.featuredDescription,
                  { color: theme.textSecondary },
                ]}
              >
                {activeFocusLab.description}
              </Text>
              <View style={styles.featuredFooter}>
                <CustomButton
                  title="View Details →"
                  size="sm"
                  variant="primary"
                  onPress={() =>
                    navigation.navigate('LabDetail', { lab: activeFocusLab })
                  }
                />
                <TouchableOpacity
                  onPress={() => toggleLabStatus(activeFocusLab.id)}
                  style={[
                    styles.toggleStatusChip,
                    { backgroundColor: theme.surfaceAlt },
                  ]}
                >
                  <Text style={[styles.toggleStatusText, { color: theme.textSecondary }]}>
                    Cycle Status
                  </Text>
                </TouchableOpacity>
              </View>
            </CustomCard>
          </View>
        ) : null}

        {/* Straightforward Laboratory Activities List (Clean, No Category Pills) */}
        <View style={[styles.section, { marginBottom: 28 }]}>
          <SectionHeader
            title="Laboratory Activities"
            subtitle="Compilation repository for course deliverables"
            actionText="+ Add Lab"
            onActionPress={() => navigation.navigate('Labs')}
          />

          {labs.length === 0 ? (
            <CustomCard padding={20} style={styles.emptyCard}>
              <Text style={{ fontSize: 32, marginBottom: 6 }}>📋</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Laboratory Activities Yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Get started by creating your first laboratory activity using the button below.
              </Text>
              <CustomButton
                title="+ Add Laboratory Activity"
                size="sm"
                variant="primary"
                onPress={() => navigation.navigate('Labs')}
                style={{ marginTop: 12 }}
              />
            </CustomCard>
          ) : (
            labs.slice(0, 5).map((item) => (
              <CustomCard
                key={item.id}
                onPress={() => navigation.navigate('LabDetail', { lab: item })}
                style={styles.labCard}
                padding={14}
              >
                <View style={styles.labCardHeader}>
                  <View style={styles.labCardTitleGroup}>
                    <Text style={[styles.labNumber, { color: theme.primary }]}>
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
                <View style={styles.labCardFooter}>
                  <Text style={[styles.categoryTag, { color: theme.textMuted }]}>
                    {item.category} • Due: {item.dueDate}
                  </Text>
                  <Text style={[styles.openLink, { color: theme.primary }]}>
                    Open Details →
                  </Text>
                </View>
              </CustomCard>
            ))
          )}

          {labs.length > 5 && (
            <CustomButton
              title={`View All ${labs.length} Activities in Directory →`}
              variant="outline"
              size="sm"
              fullWidth
              onPress={() => navigation.navigate('Labs')}
              style={{ marginTop: 4 }}
            />
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  courseBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dotSeparator: {
    marginHorizontal: 4,
    fontSize: 12,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  themeToggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  metricsGrid: {
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCard: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: 12,
  },
  featuredCard: {
    marginVertical: 4,
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    fontSize: 22,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleStatusChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  toggleStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    marginVertical: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 280,
  },
  labCard: {
    marginBottom: 10,
  },
  labCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  labCardTitleGroup: {
    flex: 1,
    paddingRight: 6,
  },
  labNumber: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  labTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  labDescription: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  labCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000012',
  },
  categoryTag: {
    fontSize: 11,
  },
  openLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});
