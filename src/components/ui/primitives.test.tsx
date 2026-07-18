import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Progress } from './progress';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from './sheet';

describe('Button', () => {
  it('renders children and responds to clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    await userEvent.click(screen.getByText('Guardar'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Tabs', () => {
  it('switches content when a trigger is clicked', async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Contenido A</TabsContent>
        <TabsContent value="b">Contenido B</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Contenido A')).toBeInTheDocument();
    await userEvent.click(screen.getByText('B'));
    await waitFor(() => {
      expect(screen.getByText('Contenido B')).toBeInTheDocument();
    });
  });
});

describe('Progress', () => {
  it('renders without crashing at a given value', () => {
    render(<Progress value={40} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('Sheet', () => {
  it('opens content when the trigger is clicked', async () => {
    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    await userEvent.click(screen.getByText('Abrir'));
    await waitFor(() => {
      expect(screen.getByText('Título')).toBeInTheDocument();
    });
  });
});
