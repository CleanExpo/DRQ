import React from 'react';
import Script from 'next/script';

interface SchemaProviderProps {
  schemas: any[];
}

export const SchemaProvider: React.FC<SchemaProviderProps> = ({ schemas }) => {
  // Filter out any undefined or null schemas
  const validSchemas = schemas.filter(Boolean);

  if (validSchemas.length === 0) {
    return null;
  }

  // If there's only one schema, use it directly
  // If there are multiple schemas, wrap them in an array
  const schemaData = validSchemas.length === 1 
    ? validSchemas[0] 
    : validSchemas;

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, process.env.NODE_ENV === 'development' ? 2 : 0)
      }}
      strategy="afterInteractive"
    />
  );
};

// HOC to wrap pages with schema data
export const withSchema = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  getSchemas: (props: P) => any[]
) => {
  const WithSchema = (props: P) => {
    const schemas = getSchemas(props);

    return (
      <>
        <SchemaProvider schemas={schemas} />
        <WrappedComponent {...props} />
      </>
    );
  };

  WithSchema.displayName = `WithSchema(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithSchema;
};

// Example usage:
/*
export default withSchema(HomePage, () => [
  generateOrganizationSchema(),
  generateLocalBusinessSchema()
]);
*/
