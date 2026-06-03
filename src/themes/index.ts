export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  tabBar: {
    background: string;
    border: string;
    active: string;
    inactive: string;
  };
  timer: {
    focusColor: string;
    breakColor: string;
    text: string;
  };
}

export const lightTheme: Theme = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  primary: '#FF6B6B',
  tabBar: {
    background: '#FFFFFF',
    border: '#E0E0E0',
    active: '#FF6B6B',
    inactive: '#999999',
  },
  timer: {
    focusColor: '#FF6B6B',
    breakColor: '#4CAF50',
    text: '#333333',
  },
};

export const darkTheme: Theme = {
  background: '#1A1A1A',
  card: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#404040',
  primary: '#FF6B6B',
  tabBar: {
    background: '#2D2D2D',
    border: '#404040',
    active: '#FF6B6B',
    inactive: '#888888',
  },
  timer: {
    focusColor: '#FF6B6B',
    breakColor: '#4CAF50',
    text: '#FFFFFF',
  },
};

export const themes: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
