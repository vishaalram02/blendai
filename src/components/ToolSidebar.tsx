import { useState } from 'react';
import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack } from '@mantine/core';
import {
  TablerIcon,
  IconBrush,
  IconZoomIn,
  IconWand,
  IconRectangle,
  IconLasso,
  IconColorPicker,
  IconBucket
} from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  link: {
    width: 30,
    height: 30,
    padding: 5,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconBrush, label: 'Brush' },
  { icon: IconWand, label: 'Magic Wand' },
  { icon: IconRectangle, label: 'Rectangle Select' },
  { icon: IconLasso, label: 'Lasso Tool' },
  { icon: IconColorPicker, label: 'Color Picker' },
  { icon: IconZoomIn, label: 'Zoom In' },
  { icon: IconBucket, label: 'Paint Bucket' }
];

export function ToolSidebar() {
  const [active, setActive] = useState(2);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <Navbar height={750} width={{ base: 60 }} p="md">
      {/* <Center>
        <MantineLogo type="mark" size={30} />
      </Center> */}
      <Navbar.Section grow>
        <Stack justify="center" spacing={15}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink icon={IconLogout} label="Logout" /> */}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}