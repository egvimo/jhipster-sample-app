package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc4Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc4.class);
        Abc4 abc41 = new Abc4();
        abc41.setId(1L);
        Abc4 abc42 = new Abc4();
        abc42.setId(abc41.getId());
        assertThat(abc41).isEqualTo(abc42);
        abc42.setId(2L);
        assertThat(abc41).isNotEqualTo(abc42);
        abc41.setId(null);
        assertThat(abc41).isNotEqualTo(abc42);
    }
}
