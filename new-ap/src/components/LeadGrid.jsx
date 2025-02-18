import { Container, Grid, SimpleGrid, Skeleton, Paper } from '@mantine/core';

const PRIMARY_COL_HEIGHT = '300px';

function LeadGrid() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <Container my="md">
      <Paper shadow="sm" radius="md" p="md" withBorder>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Skeleton 
            height={PRIMARY_COL_HEIGHT} 
            radius="md" 
            animate={true} 
            style={{ backgroundColor: '#E0E0E0' }} 
          />
          <Grid gutter="md">
            <Grid.Col>
              <Skeleton 
                height={SECONDARY_COL_HEIGHT} 
                radius="md" 
                animate={true} 
                style={{ backgroundColor: '#E0E0E0' }} 
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton 
                height={SECONDARY_COL_HEIGHT} 
                radius="md" 
                animate={true} 
                style={{ backgroundColor: '#E0E0E0' }} 
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton 
                height={SECONDARY_COL_HEIGHT} 
                radius="md" 
                animate={true} 
                style={{ backgroundColor: '#E0E0E0' }} 
              />
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}

export default LeadGrid;
